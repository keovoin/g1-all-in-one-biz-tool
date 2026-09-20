import { ITokenJob } from './interfaces';
export declare class TokenCleanupScheduler {
    private readonly logger;
    enqueueExpiredCleanup(): Promise<ITokenJob>;
    enqueueInactiveCleanup(): Promise<ITokenJob>;
}
