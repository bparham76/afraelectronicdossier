import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';

import {
	createAttachment,
	deleteAttachment,
	getAttachment,
	updateAttachment,
} from '../services/attachments.js';

const attachmentsRouter = express.Router();

attachmentsRouter.use(AuthMiddleware());

attachmentsRouter.post('/', createAttachment);
attachmentsRouter.get('/:id', getAttachment);
attachmentsRouter.put('/:id', updateAttachment);
attachmentsRouter.delete('/:id', deleteAttachment);

export default attachmentsRouter;
