import { DiscoveredScheduledJob, RegisterScheduledJobInput } from '../interfaces/discovered-scheduled-job.interface';
import { ResolvedSchedulerModuleOptions } from '../interfaces/scheduler-module-options.interface';
export declare class SchedulerJobRegistryService {
    private readonly moduleOptions;
    private readonly jobs;
    constructor(moduleOptions: ResolvedSchedulerModuleOptions);
    register(input: RegisterScheduledJobInput): DiscoveredScheduledJob;
    getAll(): DiscoveredScheduledJob[];
    getById(id: string): DiscoveredScheduledJob | undefined;
    private resolveJobId;
    private resolveJobOptions;
    private toNonNegativeInteger;
    private toPositiveInteger;
}
