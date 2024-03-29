import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';

import { createAttachment, deleteAttachment } from '../services/attachments.js';

import { v4 as uuid } from 'uuid';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'attachments'),
	filename: (req, file, cb) =>
		cb(null, uuid() + '.' + file.originalname.split('.').at(-1)),
});

const upload = new multer({ storage: storage });

const attachmentsRouter = express.Router();

attachmentsRouter.use(AuthMiddleware());

attachmentsRouter.post('/', upload.single('cargo'), createAttachment);
attachmentsRouter.delete('/:id', deleteAttachment);

export default attachmentsRouter;
