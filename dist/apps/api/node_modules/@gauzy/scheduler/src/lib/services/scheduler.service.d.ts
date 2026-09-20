import { SchedulerJobDescriptor } from '../interfaces/scheduler-job-descriptor.interface';
import { SchedulerQueueJobInput } from '../interfaces/scheduler-queue-job.interface';
import { SchedulerJobRegistryService } from './scheduler-job-registry.service';
import { SchedulerJobRunnerService } from './scheduler-job-runner.service';
import { SchedulerQueueService } from './scheduler-queue.service';
export declare class SchedulerService {
    private readonly jobRegistry;
    private readonly jobRunner;
    private readonly queueService;
    constructor(jobRegistry: SchedulerJobRegistryService, jobRunner: SchedulerJobRunnerService, queueService: SchedulerQueueService);
    listJobs(): SchedulerJobDescriptor[];
    triggerNow(jobId: string): Promise<void>;
    enqueue<TData = unknown>(input: SchedulerQueueJobInput<TData>): Promise<void>;
    private resolveScheduleType;
}
