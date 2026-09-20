import { DiscoveredScheduledJob } from '../interfaces/discovered-scheduled-job.interface';
import { ResolvedSchedulerModuleOptions } from '../interfaces/scheduler-module-options.interface';
import { SchedulerQueueService } from './scheduler-queue.service';
export declare class SchedulerJobRunnerService {
    private readonly moduleOptions;
    private readonly queueService;
    private readonly logger;
    private readonly runningJobs;
    constructor(moduleOptions: ResolvedSchedulerModuleOptions, queueService: SchedulerQueueService);
    isRunning(jobId: string): boolean;
    execute(job: DiscoveredScheduledJob): Promise<void>;
    private executeWithRetry;
    private executeSingleAttempt;
    private executeJobHandler;
}
