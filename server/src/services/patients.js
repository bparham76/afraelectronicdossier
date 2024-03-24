import prisma from '../utils/prisma.js';
import moment from 'jalali-moment';

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

export async function getSinglePatient(req, res) {}

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

export async function deletePatient(req, res) {}

export async function updatePatient(req, res) {}

export async function findPatients(req, res) {
	try {
		const { query } = req.params;
		const result = await prisma.patient.findMany({
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
