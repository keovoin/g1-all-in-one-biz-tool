"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheHealthIndicator = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const uuid_1 = require("uuid");
let CacheHealthIndicator = class CacheHealthIndicator {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    /**
     * @param {string} key - The service key to check (e.g., 'cache').
     * @param {boolean} isHealthy - Whether the service is healthy.
     * @param {Record<string, any>} data - Additional data to include in the result.
     * @returns {HealthIndicatorResult} - The health check result.
     */
    getStatus(key, isHealthy, data = {}) {
        return {
            [key]: {
                status: isHealthy ? 'up' : 'down',
                ...data
            }
        };
    }
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
    async isHealthy(key) {
        if (key !== 'cache') {
            throw new Error(`Invalid key for cache health check: ${key}`);
        }
        const randomKey = `health-check-${(0, uuid_1.v4)()}`;
        let isHealthy = false;
        try {
            // Attempt to set and retrieve a test key from the cache
            await this.cacheManager.set(randomKey, 'health', 60 * 1000);
            isHealthy = (await this.cacheManager.get(randomKey)) === 'health';
        }
        catch (error) {
            console.error('Error saving/retrieving data from cache:', error);
        }
        // Determine cache type (Redis or in-memory)
        const cacheType = process.env.REDIS_ENABLED === 'true' ? 'redis' : 'memory';
        // Build health check result
        const result = this.getStatus(key, isHealthy, { cacheType });
        if (isHealthy) {
            return result;
        }
        // Throw an error if the health check fails
        throw new Error(`Cache health check failed: ${JSON.stringify(result)}`);
    }
};
exports.CacheHealthIndicator = CacheHealthIndicator;
exports.CacheHealthIndicator = CacheHealthIndicator = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object])
], CacheHealthIndicator);
//# sourceMappingURL=cache-health.indicator.js.map