import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import moment from 'jalali-moment';

const prisma = new PrismaClient();

import { fakerFA } from '@faker-js/faker';

const DATA_COUNT = 120;

const userData = [
	{
		firstName: 'پرهام',
		lastName: 'باقی زاده',
		username: 'super',
		password: bcrypt.hashSync('1234', 10),
		role: 'SuperAdmin',
		state: 'Active',
	},
	{
		firstName: 'رجب',
		lastName: 'رحمانلو',
		username: 'secrecep',
		password:
			'$2b$10$Y6LuuzPYw8wHRpMRfDICUuJoFiM/tmTNFfFRPylZVI99F1jFOsQjC',
		role: 'Secretary',
		state: 'Active',
	},
	{
		firstName: 'مشکین',
		lastName: 'نظری فرد	',
		username: 'mesk1',
		password:
			'$2b$10$3lbUOpziqkTEN1cxOJBI/uokodqiuHJ11patzzqDlWd6ZQ058Emh.',
		role: 'Doctor',
		state: 'Active',
	},
];

const storageData = [
	{
		drug: 'B2',
		quantity: parseInt(DATA_COUNT / 3) * 10,
	},
	{
		drug: 'Opium',
		quantity: parseInt(DATA_COUNT / 3) * 10,
	},
	{
		drug: 'Metadon',
		quantity: parseInt(DATA_COUNT / 3) * 10,
	},
];

const settingsData = [
	{
		name: 'app_state',
		value: 'Active',
	},
	{
		name: 'app_first_run',
		value: '',
	},
	{
		name: 'cap_b2',
		value: (parseInt(DATA_COUNT / 3) + 1).toString(),
	},
	{
		name: 'cap_opium',
		value: (parseInt(DATA_COUNT / 3) + 1).toString(),
	},
	{
		name: 'cap_metadon',
		value: (parseInt(DATA_COUNT / 3) + 1).toString(),
	},
];

async function main() {
	console.log(`Start seeding ...`);
	await prisma.user.createMany({ data: userData });

	let male = true;
	let patientData = [];
	for (let i = 0; i < DATA_COUNT; i++) {
		patientData.push({
			firstName: fakerFA.person.firstName(male && 'male'),
			lastName: fakerFA.person.lastName(),
			nationalID: fakerFA.string.numeric({ length: 10 }),
			phone: '09' + fakerFA.string.numeric({ length: 9 }),
			landLine: '0' + fakerFA.string.numeric({ length: 10 }),
			gender: male ? 'Male' : 'Female',
			address: fakerFA.location
				.streetAddress({
					useFullAddress: true,
				})
				.toString(),
			birthDate: fakerFA.date
				.birthdate({
					min: 1970,
					max: 1992,
					mode: 'year',
				})
				.toISOString(),
		});
		male = !male;
	}
	await prisma.patient.createMany({ data: patientData });

	await prisma.storage.createMany({ data: storageData });

	await prisma.settings.createMany({ data: settingsData });

	let dossierData = [];
	for (let i = 1; i <= DATA_COUNT; i++) {
		dossierData.push({
			patientId: i,
			drugType: i % 3 == 1 ? 'B2' : i % 3 == 2 ? 'Metadon' : 'Opium',
			dossierNumber: fakerFA.string.numeric({ length: 6 }),
			state: 'Active',
		});
	}

	await prisma.dossier.createMany({ data: dossierData });

	const ds = await prisma.dossier.findMany();

	let receptions = [];
	ds?.forEach(dossier => {
		for (let j = 0; j < fakerFA.number.int({ min: 10, max: 20 }); j++) {
			const _date = fakerFA.date
				.between({
					from: '2022-01-01T00:00:00.000Z',
					to: '2024-03-29T00:00:00.000Z',
				})
				.toISOString();
			const _dose = fakerFA.number.int({ min: 5, max: 25 });
			receptions.push({
				dossierId: dossier.id,
				drugDose: _dose,
				datetime: _date,
				description: fakerFA.lorem.sentences({
					min: 2,
					max: 5,
				}),
			});
		}
	});

	await prisma.reception.createMany({ data: receptions });

	const rcps = await prisma.reception.findMany({
		include: { dossier: true },
	});

	const transactions = rcps?.map(r => ({
		date: r.datetime,
		drug: r.dossier.drugType,
		quantity: r.drugDose,
		type: 'NewReception',
		receptionId: r.id,
	}));

	await prisma.storageTransaction.createMany({ data: transactions });

	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
