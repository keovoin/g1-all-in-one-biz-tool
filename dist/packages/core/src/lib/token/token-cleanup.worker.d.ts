import { QueueWorkerHost } from '@gauzy/scheduler';
import { CommandBus } from '@nestjs/cqrs';
import { Job } from 'bullmq';
import { ITokenJob } from './interfaces';
import { TokenConfigRegistry } from './token-config.registry';
export declare class TokenCleanupWorker extends QueueWorkerHost {
    private readonly commandBus;
    private readonly configRegistry;
    private readonly logger;
    constructor(commandBus: CommandBus, configRegistry: TokenConfigRegistry);
    handleExpired(job: Job<ITokenJob>): Promise<void>;
    handleInactive(job: Job<ITokenJob>): Promise<void>;
}
