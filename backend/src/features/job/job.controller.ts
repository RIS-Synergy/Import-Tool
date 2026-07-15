import { Request, Response } from 'express';
import { jobManager } from './job.service.js';

export class JobController {
  public getAllJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      // Optional: Cleanup old jobs periodically when queried
      jobManager.cleanupOldJobs(24);
      const jobs = jobManager.getAllJobs();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving jobs' });
    }
  };

  public getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const job = jobManager.getJob(id);
      if (job) {
        res.status(200).json(job);
      } else {
        res.status(404).json({ message: `Job with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving job' });
    }
  };

  public cancelJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const job = jobManager.getJob(id);
      if (job) {
        jobManager.cancelJob(id);
        res.status(200).json({ message: `Job ${id} cancelled successfully.` });
      } else {
        res.status(404).json({ message: `Job with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error cancelling job' });
    }
  };
}
