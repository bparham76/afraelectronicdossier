import prisma from './prisma.js';
import bcrypt from 'bcrypt';

export const getUserFromToken = async token => {
	const tokens = await prisma.accessToken.findMany({
		select: {
			id: true,
			hashed: true,
			user: {
				select: {
					username: true,
					role: true,
					id: true,
				},
			},
		},
	});

	return (
		tokens?.find(item => bcrypt.compareSync(token, item.hashed)) ||
		undefined
	);
};
