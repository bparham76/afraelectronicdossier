import { AuthMiddleware } from '../middlewares/auth.js';
import express from 'express';

import {
	createPatient,
	deletePatient,
	getAllPatients,
	getSinglePatient,
	updatePatient,
	findPatients,
	findPatientsForSelector,
} from '../services/patients.js';

const patientRouter = express.Router();

patientRouter.use('/', AuthMiddleware());

patientRouter.post('/', createPatient);
patientRouter.get('/', getAllPatients);
patientRouter.get('/:id', getSinglePatient);
patientRouter.get('/s/:query', findPatients);
patientRouter.get('/s/s/:query', findPatientsForSelector);
patientRouter.put('/', updatePatient);
patientRouter.delete('/', deletePatient);

export default patientRouter;
