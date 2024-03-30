import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth.js';
import patientRouter from './routes/patients.js';
import dossierRouter from './routes/dossiers.js';
import attachmentsRouter from './routes/attachments.js';
import receptionRouter from './routes/reception.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/static', express.static('attachments'));

app.use('/auth', authRouter);
app.use('/patient', patientRouter);
app.use('/dossier', dossierRouter);
app.use('/attachment', attachmentsRouter);
app.use('/reception', receptionRouter);

const server = app.listen(4000, () => console.log('server running... .'));
