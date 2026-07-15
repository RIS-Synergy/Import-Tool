export type JobStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Job {
  id: string;
  type: string; // e.g., 'sync', 'discover', 'diffSync'
  targetId: string;
  status: JobStatus;
  progress: number; // 0 to 100 or actual count depending on total
  total?: number;
  message?: string;
  result?: any;
  createdAt: Date;
  updatedAt: Date;
}

class JobManager {
  private jobs: Map<string, Job> = new Map();

  /**
   * Starts a new job. Throws an error if the job is already running.
   */
  public startJob(id: string, type: string, targetId: string, message: string = 'Starting...'): Job {
    const existingJob = this.jobs.get(id);
    if (existingJob && existingJob.status === 'RUNNING') {
      throw new Error(`Job ${id} is already running.`);
    }

    const job: Job = {
      id,
      type,
      targetId,
      status: 'RUNNING',
      progress: 0,
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.set(id, job);
    return job;
  }

  /**
   * Updates an existing job's progress.
   */
  public updateJob(id: string, progress: number, total?: number, message?: string) {
    const job = this.jobs.get(id);
    if (job) {
      job.progress = progress;
      if (total !== undefined) job.total = total;
      if (message !== undefined) job.message = message;
      job.updatedAt = new Date();
    }
  }

  /**
   * Marks a job as COMPLETED.
   */
  public completeJob(id: string, message: string = 'Completed', result?: any) {
    const job = this.jobs.get(id);
    if (job) {
      job.status = 'COMPLETED';
      job.message = message;
      if (result !== undefined) {
        job.result = result;
      }
      job.updatedAt = new Date();
    }
  }

  /**
   * Marks a job as FAILED.
   */
  public failJob(id: string, message: string = 'Failed') {
    const job = this.jobs.get(id);
    if (job) {
      job.status = 'FAILED';
      job.message = message;
      job.updatedAt = new Date();
    }
  }
  
  /**
   * Marks a job as CANCELLED.
   */
  public cancelJob(id: string, message: string = 'Cancelled by user') {
    const job = this.jobs.get(id);
    if (job && job.status === 'RUNNING') {
      job.status = 'CANCELLED';
      job.message = message;
      job.updatedAt = new Date();
    }
  }

  /**
   * Checks if a job has been cancelled.
   */
  public isJobCancelled(id: string): boolean {
    const job = this.jobs.get(id);
    return job ? job.status === 'CANCELLED' : false;
  }

  /**
   * Retrieves a specific job by ID.
   */
  public getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  /**
   * Retrieves all jobs.
   */
  public getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Helper to clean up old jobs (optional)
   */
  public cleanupOldJobs(olderThanHours: number = 24) {
    const threshold = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    for (const [id, job] of this.jobs.entries()) {
      if (job.status !== 'RUNNING' && job.updatedAt < threshold) {
        this.jobs.delete(id);
      }
    }
  }
}

export const jobManager = new JobManager();
