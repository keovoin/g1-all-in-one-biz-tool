import { OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';
export declare const EVER_REDIS_CLIENT = "EVER_REDIS_CLIENT";
export declare class RedisModule implements OnModuleDestroy {
    private readonly redisClient;
    constructor(redisClient: ReturnType<typeof createClient> | null);
    onModuleDestroy(): Promise<void>;
}
