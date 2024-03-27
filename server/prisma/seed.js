import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import moment from 'jalali-moment';

const prisma = new PrismaClient();

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
		quantity: 30,
	},
	{
		drug: 'Opium',
		quantity: 24,
	},
	{
		drug: 'Metadon',
		quantity: 26,
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
		value: '5',
	},
	{
		name: 'cap_opium',
		value: '5',
	},
	{
		name: 'cap_metadon',
		value: '5',
	},
];

const patientData = [
	{
		firstName: 'گلمراد',
		lastName: 'مرجوئی',
		birthDate: moment.from('1339/5/19', 'fa', 'YYYY/MM/DD').toISOString(),
		nationalID: '2111512010',
		address: 'سای',
		phone: '09352114212',
		landLine: '01133324587',
		gender: 'Male',
	},
	{
		firstName: 'رسول',
		lastName: 'محترم',
		birthDate: moment.from('1348/12/7', 'fa', 'YYYY/MM/DD').toISOString(),
		nationalID: '0012452210',
		address: 'تهران میدان آرژانتین	',
		phone: '09120113614',
		landLine: '02144325877',
		gender: 'Male',
	},
	{
		firstName: 'منصوره',
		lastName: 'مقصودی نیا',
		birthDate: moment.from('1361/7/13', 'fa', 'YYYY/MM/DD').toISOString(),
		nationalID: '9092014785',
		address: 'کرج',
		phone: '09021142366',
		landLine: '02154778758',
		gender: 'Female',
	},
	{
		firstName: 'مونا',
		lastName: 'باباجانی',
		birthDate: moment.from('1367/9/27', 'fa', 'YYYY/MM/DD').toISOString(),
		nationalID: '0014225711',
		address: 'تنکابن خرم آباد',
		phone: '09352331458',
		landLine: '01123665547',
		gender: 'Female',
	},
];

async function main() {
	console.log(`Start seeding ...`);
	for (const u of userData) {
		const user = await prisma.user.create({
			data: u,
		});
		console.log(`Created user with id: ${user.id}`);
	}

	for (const u of patientData) {
		const user = await prisma.patient.create({
			data: u,
		});
		console.log(`Created patient with id: ${user.id}`);
	}

	for (const u of storageData) {
		const user = await prisma.storage.create({
			data: u,
		});
		console.log(`Created storage entry with id: ${user.id}`);
	}

	for (const u of settingsData) {
		const user = await prisma.settings.create({
			data: u,
		});
		console.log(`Created setting entry with id: ${user.id}`);
	}
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
