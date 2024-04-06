import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';

import { getAnnualReport, getMonthlyReport } from '../services/reports.js';

const reportReouter = express.Router();

reportReouter.use(AuthMiddleware());
reportReouter.get('/monthly/:year/:month', getMonthlyReport);
reportReouter.get('/annual/:year', getAnnualReport);

export default reportReouter;
