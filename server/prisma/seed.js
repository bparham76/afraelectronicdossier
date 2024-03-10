import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userData = [
	{
		firstName: 'پرهام',
		lastName: 'باقی زاده',
		username: 'super',
		password: bcrypt.hashSync('1234', 10),
		role: 'Admin',
		state: 'Active',
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
