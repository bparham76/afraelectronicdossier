import { AuthMiddleware } from '../middlewares/auth.js';
import {
	createAccessToken,
	createUser,
	getUser,
	modifyUser,
	removeAccessToken,
	removeUser,
	validateSession,
} from '../services/auth.js';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/', createAccessToken);

authRouter.use('/', AuthMiddleware());
authRouter.get('/', validateSession);
authRouter.delete('/', removeAccessToken);

authRouter.use('/user', AuthMiddleware(['Doctor', 'Secretary']));
authRouter.get('/user', getUser);
authRouter.post('/user', createUser);
authRouter.put('/user', modifyUser);
authRouter.delete('/user', removeUser);

export default authRouter;
