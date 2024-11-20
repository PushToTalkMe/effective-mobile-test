import { Router } from 'express';
import { getActionLogsByFilters } from '../controllers/action-logs.controller.js';

const actionLogsRouter = Router();

actionLogsRouter.get('/logs', getActionLogsByFilters);

export { actionLogsRouter };
