import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import prisma from './utils/prisma.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);

app.get('/', async (req, res) => {
	res.status(
		typeof req.headers.authorization !== 'undefined' ? 200 : 401
	).json({
		msg:
			typeof req.headers.authorization !== 'undefined'
				? 'auth header available'
				: 'auth header not available',
	});
});

app.get('/bc', async (req, res) => {
	const { data } = req.query;
	const result = await bcrypt.hash(data || 'dumm', 10);
	res.json({ hash: result });
});

const server = app.listen(4000, () => console.log('server running... .'));
