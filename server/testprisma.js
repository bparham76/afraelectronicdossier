import { PrismaClient } from '@prisma/client';

function my() {
	const prisma = new PrismaClient();
	prisma.accessToken.findMany({ include: { user: true } });
}
