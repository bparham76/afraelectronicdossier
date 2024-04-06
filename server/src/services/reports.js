import prisma from '../utils/prisma.js';
import moment from 'jalali-moment';

export async function getMonthlyReport(req, res) {
	try {
		const { month, year } = req.params;

		const begin = moment
			.from(`${year}/${month}/1`, 'fa', 'YYYY/M/D')
			.toISOString();
		const end = moment.from(begin).add(1, 'months').toISOString();
		const daysCount = moment.from(end).diff(moment.from(begin), 'days');

		const _data = await prisma.storageTransaction.findMany({
			where: {
				date: {
					gte: begin,
					lte: end,
				},
			},
			orderBy: { date: 'asc' },
			select: {
				date: true,
				drug: true,
				quantity: true,
				type: true,
			},
		});

		const _sorted = _data.map(e => ({
			...e,
			date: moment.from(e.date).format('jD'),
		}));

		let resultOut = {
			Metadon: Array(daysCount).fill(0),
			B2: Array(daysCount).fill(0),
			Opium: Array(daysCount).fill(0),
		};

		for (let i = 1; i <= daysCount; i++) {
			resultOut.Metadon[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Metadon' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewReception'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultOut.Opium[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Opium' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewReception'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultOut.B2[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'B2' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewReception'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
		}

		let resultIn = {
			Metadon: Array(daysCount).fill(0),
			B2: Array(daysCount).fill(0),
			Opium: Array(daysCount).fill(0),
		};

		for (let i = 1; i <= daysCount; i++) {
			resultIn.Metadon[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Metadon' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewShipment'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultIn.Opium[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Opium' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewShipment'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultIn.B2[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'B2' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewShipment'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
		}

		res.json({
			data: {
				days: daysCount,
				stats: { in: resultIn, out: resultOut },
				aggregate: {
					in: {
						Metadon: resultIn?.Metadon?.reduce(
							(acc, curr) => acc + curr,
							0
						),
						B2: resultIn?.B2?.reduce((acc, curr) => acc + curr, 0),
						Opium: resultIn?.Opium?.reduce(
							(acc, curr) => acc + curr,
							0
						),
					},
					out: {
						Metadon: resultOut?.Metadon?.reduce(
							(acc, curr) => acc + curr,
							0
						),
						Opium: resultOut?.Opium?.reduce(
							(acc, curr) => acc + curr,
							0
						),
						B2: resultOut?.B2?.reduce((acc, curr) => acc + curr, 0),
					},
				},
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}

export async function getAnnualReport(req, res) {
	try {
		const { year } = req.params;

		const begin = moment
			.from(`${year}/1/1`, 'fa', 'YYYY/M/D')
			.toISOString();
		const end = moment.from(begin).add(12, 'months').toISOString();

		const _data = await prisma.storageTransaction.findMany({
			where: {
				date: {
					gte: begin,
					lte: end,
				},
			},
			orderBy: { date: 'asc' },
			select: {
				date: true,
				drug: true,
				quantity: true,
				type: true,
			},
		});

		const _sorted = _data.map(e => ({
			...e,
			date: moment.from(e.date).format('jM'),
		}));

		let resultOut = {
			Metadon: Array(12).fill(0),
			B2: Array(12).fill(0),
			Opium: Array(12).fill(0),
		};

		for (let i = 1; i <= 12; i++) {
			resultOut.Metadon[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Metadon' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewReception'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultOut.Opium[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Opium' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewReception'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultOut.B2[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'B2' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewReception'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
		}

		let resultIn = {
			Metadon: Array(12).fill(0),
			B2: Array(12).fill(0),
			Opium: Array(12).fill(0),
		};

		for (let i = 1; i <= 12; i++) {
			resultIn.Metadon[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Metadon' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewShipment'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultIn.Opium[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'Opium' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewShipment'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
			resultIn.B2[i - 1] = _sorted
				.filter(
					_s =>
						_s.drug === 'B2' &&
						parseInt(_s.date) === i &&
						_s.type === 'NewShipment'
				)
				.reduce((acc, curr) => acc + curr.quantity, 0);
		}

		res.json({
			data: {
				stats: { in: resultIn, out: resultOut },
				aggregate: {
					in: {
						Metadon: resultIn?.Metadon?.reduce(
							(acc, curr) => acc + curr,
							0
						),
						B2: resultIn?.B2?.reduce((acc, curr) => acc + curr, 0),
						Opium: resultIn?.Opium?.reduce(
							(acc, curr) => acc + curr,
							0
						),
					},
					out: {
						Metadon: resultOut?.Metadon?.reduce(
							(acc, curr) => acc + curr,
							0
						),
						Opium: resultOut?.Opium?.reduce(
							(acc, curr) => acc + curr,
							0
						),
						B2: resultOut?.B2?.reduce((acc, curr) => acc + curr, 0),
					},
				},
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
}
