import { ModuleRef } from '@nestjs/core';
import { SchedulerQueueJobInput } from '../interfaces/scheduler-queue-job.interface';
import { ResolvedSchedulerModuleOptions } from '../interfaces/scheduler-module-options.interface';
export declare class SchedulerQueueService {
    private readonly moduleRef;
    private readonly moduleOptions;
    constructor(moduleRef: ModuleRef, moduleOptions: ResolvedSchedulerModuleOptions);
    enqueue<TData = unknown>(input: SchedulerQueueJobInput<TData>): Promise<void>;
    private getQueue;
}
