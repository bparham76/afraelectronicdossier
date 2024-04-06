import { AuthMiddleware } from '../middlewares/auth.js';
import {
	createAccessToken,
	createUser,
	getUser,
	getAllUsers,
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

authRouter.use('/user', AuthMiddleware(['Doctor', 'SuperAdmin']));
authRouter.get('/user', getUser);
authRouter.get('/users', getAllUsers);
authRouter.post('/user', createUser);
authRouter.put('/user/:id', modifyUser);
authRouter.delete('/user/:id', removeUser);

export default authRouter;
