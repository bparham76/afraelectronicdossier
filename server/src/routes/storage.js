import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';

import {
	getStorageList,
	addStorageEntry,
	deleteStorageEntry,
	getStorageTransactions,
} from '../services/storage.js';

const storageRouter = express.Router();

storageRouter.use(AuthMiddleware());

storageRouter.get('/', getStorageList);
storageRouter.post('/', addStorageEntry);
storageRouter.delete('/:id', deleteStorageEntry);
storageRouter.get('/transactions', getStorageTransactions);

export default storageRouter;
