import { Reflector } from '@nestjs/core';
import { ScheduledJobOptions } from '../interfaces/scheduled-job-options.interface';
export declare class ScheduledJobMetadataAccessor {
    private readonly reflector;
    constructor(reflector: Reflector);
    get(target: (...args: unknown[]) => unknown): ScheduledJobOptions | undefined;
}
