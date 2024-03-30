import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';

import {
	createReception,
	getAllReceptions,
	deleteReception,
} from '../services/reception.js';

const receptionRouter = express.Router();

receptionRouter.use(AuthMiddleware());

receptionRouter.post('/', createReception);
receptionRouter.get('/', getAllReceptions);
receptionRouter.delete('/:id', deleteReception);

export default receptionRouter;
