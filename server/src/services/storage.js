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
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}
