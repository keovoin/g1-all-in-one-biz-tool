import { HealthIndicatorResult } from '@nestjs/terminus';
export declare class RedisHealthIndicator {
    private _client;
    constructor();
    /**
     * @param {string} key - The service key to check (e.g., 'redis').
     * @param {boolean} isHealthy - Whether the service is healthy.
     * @param {Record<string, any>} data - Additional data to include in the result.
     * @returns {HealthIndicatorResult} - The health check result.
     */
    private getStatus;
    /**
     * Checks the health status of a specified service.
     *
     * @param {string} key - The service key to check (e.g., 'redis').
     * @returns {Promise<HealthIndicatorResult>} - A promise resolving to the health check result.
     *
     * @throws {HealthCheckError} - Throws an error if the health check fails.
     *
     * @description
     * This method checks the health status of Redis. If the key is 'redis', it verifies whether Redis
     * is accessible by calling `checkRedis()`. If the check fails, it throws a `HealthCheckError`.
     */
    isHealthy(key: string): Promise<HealthIndicatorResult>;
    /**
     * Starts a Redis client for health checks.
     *
     * @returns {Promise<boolean>} - A promise resolving to `true` if Redis is successfully connected, otherwise `false`.
     *
     * @description
     * This method initializes a Redis connection based on environment variables.
     * If Redis is enabled (`REDIS_ENABLED` is `'true'`), it constructs the connection URL,
     * parses authentication details, and attempts to connect using a Redis client.
     *
     * @throws {Error} - Logs errors if Redis connection fails.
     *
     * @example
     * ```ts
     * const isRedisConnected = await this.startRedis();
     * console.log(isRedisConnected ? 'Redis is healthy' : 'Redis is not available');
     * ```
     */
    private startRedis;
    private stopRedis;
    private checkRedis;
}
