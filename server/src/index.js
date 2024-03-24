import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import patientRouter from './routes/patients.js';

import moment from 'jalali-moment';
import prisma from './utils/prisma.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/patient', patientRouter);

const server = app.listen(4000, () => console.log('server running... .'));
