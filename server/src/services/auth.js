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
		select: { id: true, password: true },
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
			res.status(200).json({ token: token });
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

export const createUser = async (req, res) => {};

export const getUser = async (req, res) => {
	res.json({ msg: 'get user' });
};

export const modifyUser = async (req, res) => {};

export const removeUser = async (req, res) => {};