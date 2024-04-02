import prisma from '../utils/prisma.js';
import moment from 'jalali-moment';

export async function createReception(req, res) {
	//TODO: check for storage
	//TODO: create storage transaction
	try {
		const { dossier, day, month, year, dose, description } = req.body;

		const _dossier = await prisma.dossier.findFirst({
			where: { dossierNumber: { equals: dossier } },
			select: { drugType: true },
		});

		const _storage = await prisma.storage.findMany();

		if (_storage.find(s => s.drug === _dossier.drugType).quantity < dose) {
			res.status(500).json({ error: 'insufficient quantity' });
			return;
		}

		const _reception = await prisma.reception.create({
			data: {
				dossier: { connect: { dossierNumber: dossier } },
				datetime: moment
					.from(`${year}/${month}/${day}`, 'fa', 'YYYY/MM/DD')
					.toISOString(),
				drugDose: parseInt(dose),
				description: description,
			},
		});

		await prisma.storageTransaction.create({
			data: {
				date: moment
					.from(`${year}/${month}/${day}`, 'fa', 'YYYY/MM/DD')
					.toISOString(),
				drug: _dossier.drugType,
				quantity: parseInt(dose),
				type: 'NewReception',
				reception: { connect: { id: _reception.id } },
			},
		});

		await prisma.storage.update({
			where: {
				drug: _dossier.drugType,
			},
			data: {
				quantity: {
					decrement: parseInt(dose),
				},
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

export async function getAllReceptions(req, res) {
	try {
		const result = await prisma.reception.findMany({
			orderBy: {
				datetime: 'desc',
			},
			select: {
				id: true,
				drugDose: true,
				datetime: true,
				dossier: {
					select: {
						dossierNumber: true,
						drugType: true,
						patient: {
							select: {
								firstName: true,
								lastName: true,
							},
						},
					},
				},
			},
		});
		res.status(200).json({
			data: result.map(r => ({
				date: moment.from(r.datetime, 'en').format('jYYYY/jM/jD'),
				id: r.id,
				name:
					r.dossier.patient.firstName +
					' ' +
					r.dossier.patient.lastName,
				number: r.dossier.dossierNumber,
				dose: r.drugDose,
				drug: r.dossier.drugType,
			})),
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getSingleReception(req, res) {
	try {
		const { id } = req.params;
		const data = await prisma.reception.findFirst({
			where: { id: parseInt(id) },
			include: {
				dossier: {
					select: {
						dossierNumber: true,
						id: true,
						drugType: true,
						patient: {
							select: {
								firstName: true,
								lastName: true,
							},
						},
					},
				},
			},
		});
		res.status(202).json({
			data: {
				...data,
				datetime: moment
					.from(data.datetime, 'en')
					.format('jYYYY/jM/jD'),
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function updateReception(req, res) {
	try {
		const { id } = req.params;
		await prisma.reception.update(
			{ where: { id: parseInt(id) } },
			{ data: req.body }
		);
		res.status(202).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function deleteReception(req, res) {
	try {
		const { id } = req.params;
		const reception = await prisma.reception.findFirst({
			where: { id: parseInt(id) },
			include: {
				transaction: true,
			},
		});

		let deltaMetadon = 0,
			deltaOpium = 0,
			deltaB2 = 0;
		// res.json({ data: reception });

		switch (reception.transaction.drug) {
			case 'Metadon':
				deltaMetadon += parseInt(reception.transaction.quantity);
				break;
			case 'Opium':
				deltaOpium += parseInt(reception.transaction.quantity);
				break;
			default:
				deltaB2 += parseInt(reception.transaction.quantity);
				break;
		}

		await prisma.storageTransaction.delete({
			where: { id: reception.transaction.id },
		});

		const storage = await prisma.storage.findMany({
			select: {
				drug: true,
				quantity: true,
			},
		});

		deltaB2 !== 0 &&
			(await prisma.storage.update({
				where: { drug: 'B2' },
				data: {
					quantity:
						storage.find(s => s.drug === 'B2').quantity + deltaB2,
				},
			}));
		deltaMetadon !== 0 &&
			(await prisma.storage.update({
				where: { drug: 'Metadon' },
				data: {
					quantity:
						storage.find(s => s.drug === 'Metadon').quantity +
						deltaMetadon,
				},
			}));
		deltaOpium !== 0 &&
			(await prisma.storage.update({
				where: { drug: 'Opium' },
				data: {
					quantity:
						storage.find(s => s.drug === 'Opium').quantity +
						deltaOpium,
				},
			}));

		await prisma.reception.delete({ where: { id: parseInt(id) } });
		res.status(202).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}
