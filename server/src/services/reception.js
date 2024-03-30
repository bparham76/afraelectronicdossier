import prisma from '../utils/prisma.js';
import moment from 'jalali-moment';

export async function createReception(req, res) {
	//TODO: check for storage
	//TODO: create storage transaction
	try {
		const { dossier, day, month, year, dose } = req.body;

		await prisma.reception.create({
			data: {
				dossier: { connect: { dossierNumber: dossier } },
				datetime: moment
					.from(`${year}/${month}/${day}`, 'fa', 'YYYY/MM/DD')
					.toISOString(),
				drugDose: parseInt(dose),
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
			select: {
				id: true,
				drugDose: true,
				datetime: true,
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
			})),
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function deleteReception(req, res) {}
