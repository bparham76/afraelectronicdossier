import moment from 'jalali-moment';
import prisma from '../utils/prisma.js';

export async function getStorageList(req, res) {
	try {
		const result = await prisma.storage.findMany();
		res.status(201).json({ data: result });
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function addStorageEntry(req, res) {
	try {
		const { B2, Opium, Metadon, year, month, day } = req.body;

		let data = [];
		Metadon !== 0 &&
			data.push({
				date: moment
					.from(`${year}/${month}/${day}`, 'fa', 'YYYY/M/D')
					.toISOString(),
				drug: 'Metadon',
				quantity: Metadon,
				type: 'NewShipment',
			});
		Opium !== 0 &&
			data.push({
				date: moment
					.from(`${year}/${month}/${day}`, 'fa', 'YYYY/M/D')
					.toISOString(),
				drug: 'Opium',
				quantity: Opium,
				type: 'NewShipment',
			});
		B2 !== 0 &&
			data.push({
				date: moment
					.from(`${year}/${month}/${day}`, 'fa', 'YYYY/M/D')
					.toISOString(),
				drug: 'B2',
				quantity: B2,
				type: 'NewShipment',
			});

		await prisma.storageTransaction.createMany({
			data: data,
		});

		Metadon &&
			(await prisma.storage.update({
				where: { drug: 'Metadon' },
				data: { quantity: { increment: Metadon } },
			}));

		Opium &&
			(await prisma.storage.update({
				where: { drug: 'Opium' },
				data: { quantity: { increment: Opium } },
			}));

		B2 &&
			(await prisma.storage.update({
				where: { drug: 'B2' },
				data: { quantity: { increment: B2 } },
			}));

		res.status(201).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function deleteStorageEntry(req, res) {
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getStorageReport(req, res) {
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getStorageTransactions(req, res) {
	try {
		const result = await prisma.storageTransaction.findMany({
			orderBy: { date: 'desc' },
			include: {
				reception: {
					select: {
						dossier: {
							select: {
								dossierNumber: true,
								patient: {
									select: {
										firstName: true,
										lastName: true,
									},
								},
							},
						},
					},
				},
			},
		});
		res.status(202).json({
			data: result.map(item => {
				const date = moment.from(item.date, 'en').format('jYYYY/jM/jD');
				delete item.date;

				if (item.type === 'NewShipment') return { ...item, date };

				const patientName =
					item.reception.dossier.patient.firstName +
					' ' +
					item.reception.dossier.patient.lastName;
				const dossierNumber = item.reception.dossier.dossierNumber;
				delete item.reception;

				return { ...item, patientName, date, dossierNumber };
			}),
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}
