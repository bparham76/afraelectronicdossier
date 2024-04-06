import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import prisma from '../utils/prisma.js';

export const createAccessToken = async (req, res) => {
	const { username, password } = req.body;

	if (typeof username == 'undefined' || typeof password == 'undefined') {
		res.status(422).json();
		return;
	}

	const user = await prisma.user.findFirst({
		where: { username: username, state: 'Active' },
		select: { id: true, password: true, role: true },
	});

	if (!user) {
		res.status(401).json();
		return;
	} else {
		if (bcrypt.compareSync(password, user.password)) {
			const token = randomstring.generate(32);
			await prisma.accessToken.create({
				data: { userId: user.id, hashed: bcrypt.hashSync(token, 10) },
			});
			res.status(200).json({ token: token, role: user.role });
			return;
		} else {
			res.status(401).json();
			return;
		}
	}
};

export const removeAccessToken = async (req, res) => {
	await prisma.accessToken.delete({ where: { id: req.token } });
	res.json({ msg: 'removed' });
};

export const validateSession = (req, res) => {
	res.json({ user: req.user });
};

export const createUser = async (req, res) => {
	try {
		const { data } = req?.body;
		await prisma.user.create({
			data: { ...data, password: bcrypt.hashSync(data.password, 10) },
		});
		res.status(201).json();
		return;
	} catch (e) {
		res.status(500).json({ err: e });
		return;
	}
};

export const getUser = async (req, res) => {
	res.json({ msg: 'get user' });
};

export const getAllUsers = async (req, res) => {
	try {
		const data = await prisma.user.findMany({
			select: {
				id: true,
				firstName: true,
				lastName: true,
				username: true,
				role: true,
				state: true,
			},
			orderBy: {
				id: 'desc',
			},
		});
		res.status(201).json({ data: data });
		return;
	} catch (e) {
		res.status(500).json({ err: e });
		return;
	}
};

export const modifyUser = async (req, res) => {};

export const removeUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await prisma.user.findFirst({
			where: { id: parseInt(id) },
			include: { AccessToken: { select: { id: true } } },
		});
		await prisma.accessToken.deleteMany({
			where: { id: { in: user.AccessToken.map(i => i.id) } },
		});
		await prisma.user.delete({ where: { id: parseInt(id) } });
		res.status(204).json();
	} catch (error) {
		console.log(error);
		res.status(500).json();
	} finally {
		return;
	}
};
