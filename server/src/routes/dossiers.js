import { AuthMiddleware } from '../middlewares/auth.js';
import express from 'express';

import {
	checkDossierCapacity,
	checkDrugCapacity,
	createDossier,
	setDrugCapacity,
	getAllDossiers,
	findDossier,
	findDossierForNewReception,
	getSingleDossier,
	updateDossier,
	chageDossierState,
	deleteDossier,
} from '../services/dossiers.js';

const dossierRouter = express.Router();

dossierRouter.use(AuthMiddleware());

dossierRouter.post('/new', createDossier);
dossierRouter.get('/all', getAllDossiers);
dossierRouter.get('/g/:id', getSingleDossier);
dossierRouter.put('/u/:id', updateDossier);
dossierRouter.put('/u/:id/:state/:patientId', chageDossierState);
dossierRouter.get('/s/:query', findDossier);
dossierRouter.get('/s/s/:query', findDossierForNewReception);
dossierRouter.get('/capacity', checkDrugCapacity);
dossierRouter.post('/capacity', setDrugCapacity);
dossierRouter.get('/capacity/dossier', checkDossierCapacity);
dossierRouter.delete('/:id', deleteDossier);

export default dossierRouter;
