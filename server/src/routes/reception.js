import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';

import {
	createReception,
	getAllReceptions,
	deleteReception,
	updateReception,
	getSingleReception,
	searchReception,
} from '../services/reception.js';

const receptionRouter = express.Router();

receptionRouter.use(AuthMiddleware());

receptionRouter.post('/', createReception);
receptionRouter.get('/', getAllReceptions);
receptionRouter.post('/s', searchReception);
receptionRouter.get('/o/:id', getSingleReception);
receptionRouter.put('/:id', updateReception);
receptionRouter.delete('/:id', deleteReception);

export default receptionRouter;
