import prisma from '../utils/prisma.js';
import moment from 'jalali-moment';
import fs from 'fs/promises';
import path from 'path/win32';

export async function checkDossierCapacity(req, res) {
	try {
		const result = await prisma.settings.findMany({
			where: {
				name: { contains: 'cap' },
			},
			select: { name: true, value: true },
		});

		const caps = result.map(i => ({
			drug: i.name.replace('cap_', ''),
			cap: i.value,
		}));

		let b2 = 0,
			metadon = 0,
			opium = 0;

		const result2 = await prisma.dossier.findMany({
			where: { inQueue: false },
		});

		result2.forEach(d => {
			switch (d.drugType) {
				case 'B2':
					b2++;
					return;
				case 'Metadon':
					metadon++;
					return;
				case 'Opium':
					opium++;
					return;
				default:
					return;
			}
		});

		res.status(201).json({
			data: [
				{ drug: 'b2', cap: caps?.find(c => c.drug == 'b2').cap - b2 },
				{
					drug: 'metadon',
					cap: caps?.find(c => c.drug == 'metadon').cap - metadon,
				},
				{
					drug: 'opium',
					cap: caps?.find(c => c.drug == 'opium').cap - opium,
				},
			],
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function checkDrugCapacity(req, res) {
	try {
		const result = await prisma.settings.findMany({
			where: {
				name: { contains: 'cap' },
			},
			select: { name: true, value: true },
		});

		res.status(200).json({
			data: result.map(i => ({
				drug: i.name.replace('cap_', ''),
				cap: i.value,
			})),
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function setDrugCapacity(req, res) {
	try {
		const { B2, Opium, Metadon } = req.body;

		if (typeof B2 !== 'undefined') {
			const B2Id = await prisma.settings.findFirst({
				where: { name: 'cap_b2' },
				select: { id: true },
			});
			await prisma.settings.update({
				where: { id: B2Id?.id },
				data: { value: B2.toString() },
			});
		}

		if (typeof Metadon !== 'undefined') {
			const MetadonId = await prisma.settings.findFirst({
				where: { name: 'cap_metadon' },
				select: { id: true },
			});
			await prisma.settings.update({
				where: { id: MetadonId?.id },
				data: { value: Metadon.toString() },
			});
		}

		if (typeof Opium !== 'undefined') {
			const OpiumId = await prisma.settings.findFirst({
				where: { name: 'cap_opium' },
				select: { id: true },
			});
			await prisma.settings.update({
				where: { id: OpiumId?.id },
				data: { value: Opium.toString() },
			});
		}

		res.status(202).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function createDossier(req, res) {
	try {
		const { patientId, drugType, inQueue, number } = req.body;
		//TODO: check for duplicate dossiers - handled in frontend
		await prisma.dossier.create({
			data: {
				patientId: patientId,
				drugType: drugType,
				state: 'Active',
				inQueue: inQueue,
				dossierNumber: number ? number : null,
			},
		});
		res.status(201).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function findDossier(req, res) {
	try {
		const { query } = req.params;
		const { queue } = req.query;
		const result = await prisma.dossier.findMany({
			orderBy: { dossierNumber: 'desc' },
			where: {
				inQueue: queue ? true : false,
				OR: [
					{
						patient: {
							OR: [
								{ firstName: { contains: query } },
								{ lastName: { contains: query } },
								{ nationalID: { contains: query } },
								{ phone: { contains: query } },
							],
						},
					},
					{ dossierNumber: { contains: query } },
				],
			},
			select: {
				patient: {
					select: {
						firstName: true,
						lastName: true,
						id: true,
						phone: true,
					},
				},
				id: true,
				dossierNumber: true,
				drugType: true,
			},
		});

		res.status(200).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function findDossierForNewReception(req, res) {
	try {
		const { query } = req.params;
		const result = await prisma.dossier.findMany({
			orderBy: { patient: { lastName: 'asc' } },
			where: {
				state: { equals: 'Active' },
				OR: [
					{ dossierNumber: { contains: query } },
					{
						patient: {
							OR: [
								{ firstName: { contains: query } },
								{ lastName: { contains: query } },
								{ phone: { contains: query } },
								{ nationalID: { contains: query } },
							],
						},
					},
				],
			},
			select: {
				id: true,
				dossierNumber: true,
				drugType: true,
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						nationalID: true,
					},
				},
			},
		});

		res.status(200).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getSingleDossier(req, res) {
	try {
		const { id } = req.params;
		// const { queue } = req.query;
		const result = await prisma.dossier.findFirst({
			where: {
				id: { equals: parseInt(id) },
				// inQueue: queue ? true : false,
			},
			include: {
				patient: true,
				records: true,
				attachments: true,
			},
		});

		const birthDate = moment
			.from(result.patient.birthDate, 'en')
			.format('jYYYY/jM/jD');

		delete result.patient.birthDate;

		const records = result.records;

		delete result.records;

		const tempRecords = records.map(r => {
			const datetime = moment
				.from(r.datetime, 'en')
				.format('jYYYY/jM/jD');
			delete r.datetime;
			return { ...r, datetime: datetime };
		});

		res.status(200).json({
			data: {
				...result,
				patient: { ...result.patient, birthDate: birthDate },
				records: [...tempRecords],
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getAllDossiers(req, res) {
	try {
		const { queue } = req.query;

		const result = await prisma.dossier.findMany({
			orderBy: { dossierNumber: 'desc' },
			where: {
				inQueue: queue ? true : false,
			},
			include: {
				patient: {
					select: { firstName: true, lastName: true, phone: true },
				},
			},
		});
		res.status(201).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function updateDossier(req, res) {
	try {
		const { id } = req.params;
		const result = await prisma.dossier.update({
			where: { id: parseInt(id) },
			data: req.body,
		});
		res.status(200).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function deleteDossier(req, res) {
	try {
		const { id } = req.params;

		const dossier = await prisma.dossier.findFirst({
			where: { id: parseInt(id) },
			include: {
				attachments: true,
				records: {
					select: {
						id: true,
						transaction: true,
					},
				},
			},
		});

		let deltaMetadon = 0,
			deltaOpium = 0,
			deltaB2 = 0;

		dossier.records.forEach(async r => {
			switch (r.transaction.drug) {
				case 'Metadon':
					deltaMetadon += parseInt(r.transaction.quantity);
					break;
				case 'Opium':
					deltaOpium += parseInt(r.transaction.quantity);
					break;
				default:
					deltaB2 += parseInt(r.transaction.quantity);
					break;
			}

			await prisma.storageTransaction.delete({
				where: { id: r.transaction.id },
			});

			await prisma.reception.delete({ where: { id: r.id } });
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

		dossier.attachments.forEach(async d => {
			await fs.unlink(path.join('attachments', d.fileAddress));
			await prisma.attachment.delete({ where: { id: d.id } });
		});

		await prisma.dossier.delete({ where: { id: parseInt(id) } });

		res.status(200).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function chageDossierState(req, res) {
	try {
		const { id, state, patientId } = req.params;
		if (state === 'active') {
			await prisma.patient.update({
				where: { id: parseInt(patientId) },
				data: {
					dossier: {
						updateMany: {
							where: { state: 'Active' },
							data: { state: 'Suspended' },
						},
					},
				},
			});
		}
		await prisma.dossier.update({
			where: {
				id: parseInt(id),
			},
			data: {
				state: state === 'active' ? 'Active' : 'Suspended',
			},
		});
		res.status(200).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function checkStorageQuantity(req, res) {
	try {
		const storage = await prisma.storage.findMany({
			select: {
				drug: true,
				quantity: true,
			},
		});
		res.status(200).json({ data: storage });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}
