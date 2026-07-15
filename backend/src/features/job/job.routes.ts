import express from 'express';
import { JobController } from './job.controller.js';

const jobRouter = express.Router();
const controller = new JobController();

jobRouter.get('/', controller.getAllJobs);
jobRouter.get('/:id', controller.getJobById);
jobRouter.post('/:id/cancel', controller.cancelJob);

export default jobRouter;
