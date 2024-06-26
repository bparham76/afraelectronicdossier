import prisma from '../utils/prisma.js';
import moment from 'jalali-moment';
import fs from 'fs/promises';
import path from 'path/win32';

export async function createPatient(req, res) {
	try {
		const { data } = req.body;

		const bd = moment
			.from(`${data.by}/${data.bm}/${data.bd}`, 'fa', 'YYYY/MM/DD')
			.toISOString();

		delete data.bd;
		delete data.bm;
		delete data.by;

		await prisma.patient.create({
			data: {
				...data,
				birthDate: bd,
			},
		});
		res.status(201).json();
		return;
	} catch (e) {
		console.log(e);
		res.status(500).json();
		return;
	}
}

export async function getSinglePatient(req, res) {
	try {
		const { id } = req.params;
		const result = await prisma.patient.findFirst({
			where: { id: { equals: parseInt(id) } },
			include: {
				attachment: true,
			},
		});
		const birthDate = moment
			.from(result.birthDate, 'en')
			.format('jYYYY/jM/jD');
		delete result.birthDate;
		res.status(200).json({ data: { ...result, birthDate: birthDate } });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getAllPatients(req, res) {
	try {
		const patients = await prisma.patient.findMany({
			orderBy: {
				id: 'desc',
			},
		});
		const result = patients.map(p => ({
			...p,
			birthDate: moment.from(p.birthDate).format('jYYYY/jM/jD'),
		}));
		res.status(200).json({ data: result });
		return;
	} catch {
		res.status(500).json();
		return;
	}
}

export async function deletePatient(req, res) {
	try {
		const { id } = req.params;
		const patient = await prisma.patient.findFirst({
			where: { id: parseInt(id) },
			include: {
				attachment: true,
				dossier: {
					include: {
						attachments: true,
						records: {
							include: {
								transaction: true,
							},
						},
					},
				},
			},
		});

		patient.attachment.forEach(async a => {
			await fs.unlink(path.join('attachments', a.fileAddress));
			await prisma.attachment.delete({ where: { id: a.id } });
		});

		let deltaMetadon = 0,
			deltaOpium = 0,
			deltaB2 = 0;

		patient.dossier.forEach(async dossier => {
			dossier.attachments.forEach(async a => {
				await fs.unlink(path.join('attachments', a.fileAddress));
				await prisma.attachment.delete({ where: { id: a.id } });
			});

			dossier.records.forEach(async rec => {
				switch (rec.transaction.drug) {
					case 'Metadon':
						deltaMetadon += parseInt(rec.transaction.quantity);
						break;
					case 'Opium':
						deltaOpium += parseInt(rec.transaction.quantity);
						break;
					default:
						deltaB2 += parseInt(rec.transaction.quantity);
						break;
				}

				await prisma.storageTransaction.delete({
					where: { id: rec.transaction.id },
				});

				await prisma.reception.delete({ where: { id: rec.id } });
			});

			await prisma.dossier.delete({ where: { id: dossier.id } });
		});

		deltaB2 !== 0 &&
			(await prisma.storage.update({
				where: { drug: 'B2' },
				data: {
					quantity: {
						increment: parseInt(deltaB2),
					},
				},
			}));
		deltaMetadon !== 0 &&
			(await prisma.storage.update({
				where: { drug: 'Metadon' },
				data: {
					quantity: {
						increment: parseInt(deltaMetadon),
					},
				},
			}));
		deltaOpium !== 0 &&
			(await prisma.storage.update({
				where: { drug: 'Opium' },
				data: {
					quantity: {
						increment: parseInt(deltaOpium),
					},
				},
			}));

		await prisma.patient.delete({ where: { id: patient.id } });

		res.status(204).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function updatePatient(req, res) {
	try {
		const data = req.body;
		const id = parseInt(data.id);
		const bd = moment
			.from(`${data.by}/${data.bm}/${data.bd}`, 'fa', 'YYYY/MM/DD')
			.toISOString();

		delete data.id;
		delete data.bd;
		delete data.bm;
		delete data.by;

		await prisma.patient.update({
			where: { id: id },
			data: { ...data, birthDate: bd },
		});
		return res.status(201).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function findPatients(req, res) {
	try {
		const { query } = req.params;
		const result = await prisma.patient.findMany({
			orderBy: { lastName: 'asc' },
			where: {
				OR: [
					{ firstName: { contains: query } },
					{ lastName: { contains: query } },
					{ nationalID: { contains: query } },
					{ phone: { contains: query } },
				],
			},
		});

		res.status(200).json({ data: result });
		return;
	} catch (e) {
		console.log(e);
		res.status(500).json();
		return;
	}
}

export async function findPatientsForSelector(req, res) {
	try {
		const { query } = req.params;
		const result = await prisma.patient.findMany({
			orderBy: { lastName: 'asc' },
			where: {
				OR: [
					{ firstName: { contains: query } },
					{ lastName: { contains: query } },
					{ nationalID: { contains: query } },
					{ phone: { contains: query } },
				],
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				nationalID: true,
				dossier: true,
			},
		});

		res.status(200).json({ data: result });
		return;
	} catch (e) {
		console.log(e);
		res.status(500).json();
		return;
	}
}
