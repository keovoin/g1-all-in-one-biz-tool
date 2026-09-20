import { HealthIndicatorResult } from '@nestjs/terminus';
import { Cache } from 'cache-manager';
export declare class CacheHealthIndicator {
    private cacheManager;
    constructor(cacheManager: Cache);
    /**
     * @param {string} key - The service key to check (e.g., 'cache').
     * @param {boolean} isHealthy - Whether the service is healthy.
     * @param {Record<string, any>} data - Additional data to include in the result.
     * @returns {HealthIndicatorResult} - The health check result.
     */
    private getStatus;
    /**
     * Checks the health status of a specified service.
     *
     * @param {string} key - The service key to check (e.g., 'cache').
     * @returns {Promise<HealthIndicatorResult>} - A promise resolving to the health check result.
     *
     * @throws {HealthCheckError} - Throws an error if the health check fails.
     *
     * @description
     * This method verifies the health of the cache system by attempting to set and retrieve a test key.
     * If the cache system is enabled (Redis or in-memory), it ensures that data can be stored and retrieved successfully.
     * If the health check fails, it throws a `HealthCheckError`.
     *
     * @example
     * ```ts
     * const isCacheHealthy = await healthService.isHealthy('cache');
     * console.log(isCacheHealthy);
     * ```
     */
    isHealthy(key: string): Promise<HealthIndicatorResult>;
}
