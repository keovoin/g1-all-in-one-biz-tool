import { ThrottlerStorage } from '@nestjs/throttler';
import { createClient } from 'redis';
type RedisClient = ReturnType<typeof createClient>;
type ThrottlerStorageRecord = Awaited<ReturnType<ThrottlerStorage['increment']>>;
/**
 * How long one bucket update may take before the request stops waiting for Redis.
 *
 * A rejected command falls back to the in-process store, but a command issued while the client is
 * merely DISCONNECTED does not reject: node-redis parks it in its offline queue and the promise
 * stays pending for as long as the reconnect loop runs. This store sits behind the GLOBAL throttler
 * guard, so a pending promise there stalls every request on the API, not just this one — hence a
 * deadline rather than an unbounded await.
 */
export declare const REDIS_THROTTLER_TIMEOUT_MS = 250;
/**
 * Rate-limit bucket store shared by every API replica.
 *
 * `@nestjs/throttler`'s default storage is a `Map` inside one Node process. Production runs several
 * API pods behind one ingress, so "5 login attempts per minute" was really `5 × replicas` per
 * minute, and every rollout reset the counters. Keeping the buckets in Redis makes the configured
 * limit the actual limit regardless of how many replicas are serving.
 *
 * Falls back to the in-process store when Redis is not configured or a command fails, so a Redis
 * outage degrades the limiter to its previous per-pod behaviour instead of taking authentication
 * down with it.
 */
export declare class RedisThrottlerStorage implements ThrottlerStorage {
    private readonly client;
    private readonly logger;
    private readonly fallback;
    constructor(client: RedisClient);
    /**
     * Registers one hit against `key` and reports the bucket state.
     *
     * Mirrors the semantics of the in-memory implementation: the counter expires `ttl` ms after the
     * first hit in the window, exceeding `limit` sets a block for `blockDuration` ms, and the
     * counter is cleared when the block is set so the window starts clean once the block lapses.
     *
     * @param key - Bucket key (already a hash of route + tracker).
     * @param ttl - Window length in milliseconds.
     * @param limit - Hits allowed within the window.
     * @param blockDuration - How long to block once the limit is exceeded, in milliseconds.
     * @param throttlerName - Name of the named throttler this hit belongs to.
     * @returns The bucket state after the hit.
     */
    increment(key: string, ttl: number, limit: number, blockDuration: number, throttlerName: string): Promise<ThrottlerStorageRecord>;
    /**
     * Rejects if `operation` has not settled within {@link REDIS_THROTTLER_TIMEOUT_MS}.
     *
     * @param operation - The Redis work to bound.
     * @returns The operation's result.
     */
    private withDeadline;
    /**
     * The Redis half of {@link increment}, kept separate so the whole sequence can be bounded by one
     * deadline rather than each command individually.
     *
     * The block check and the hit are read in ONE `MULTI`, which Redis executes without interleaving.
     * Reading the block marker in a separate round trip first let two concurrent requests both see "no
     * block"; one then created the block and cleared the counter, and the other incremented the fresh
     * counter and was admitted DURING the block. With the snapshot, every request whose hit lands after
     * the block was set also sees the block, and every request whose hit lands before it sees a count
     * that already includes the earlier hits.
     *
     * A client that is not connected is not asked at all: node-redis would park the commands in its
     * offline queue and replay them on reconnect, long after this request fell back to the in-process
     * store, double-counting it into the shared bucket.
     *
     * @param hitKey - Key holding the hit counter.
     * @param blockKey - Key holding the block marker.
     * @param ttl - Window length in milliseconds.
     * @param limit - Hits allowed within the window.
     * @param blockDuration - How long to block once the limit is exceeded, in milliseconds.
     * @returns The bucket state after the hit.
     * @throws Error when the client is not ready, so the caller takes the in-process fallback.
     */
    private incrementInRedis;
}
/**
 * Builds the throttler storage for this deployment.
 *
 * @param client - The shared Redis client, or null when Redis is not configured.
 * @returns A Redis-backed store, or `undefined` to let `ThrottlerModule` use its own in-memory one.
 */
export declare function createThrottlerStorage(client: RedisClient | null): ThrottlerStorage | undefined;
export {};
