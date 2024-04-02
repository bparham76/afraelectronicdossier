import { getUserFromToken } from '../utils/auth.js';

export const AuthMiddleware =
	(role = ['SuperAdmin', 'Doctor', 'Secretary', 'Admin']) =>
	async (req, res, next) => {
		const authHeader = req.headers.authorization;

		if (
			typeof authHeader == 'undefined' ||
			!authHeader?.includes('Bearer')
		) {
			res.status(401).json();
			return;
		}

		const token = authHeader.replace('Bearer', '').trim();

		const auth = await getUserFromToken(token);

		if (auth == undefined) {
			res.status(401).json();
			return;
		}

		if (auth.user.role !== 'SuperAdmin' && !role.includes(auth.user.role)) {
			res.status(403).json();
			return;
		}

		req.user = auth.user;
		req.token = auth.id;

		next();
	};
