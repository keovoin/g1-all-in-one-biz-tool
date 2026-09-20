import { HealthCheckService, TypeOrmHealthIndicator, DiskHealthIndicator, MikroOrmHealthIndicator, HealthCheckResult } from '@nestjs/terminus';
import { DataSource } from 'typeorm';
import { CacheHealthIndicator } from './indicators/cache-health.indicator';
import { RedisHealthIndicator } from './indicators/redis-health.indicator';
import { TypeOrmUserRepository } from '../user/repository/type-orm-user.repository';
import { MikroOrmUserRepository } from '../user/repository/mikro-orm-user.repository';
export declare class HealthService {
    private readonly dataSource;
    private readonly diskHealthIndicator;
    private readonly healthCheckService;
    private readonly typeOrmHealthIndicator;
    private readonly mikroOrmHealthIndicator;
    private readonly cacheHealthIndicator;
    private readonly redisHealthIndicator;
    private readonly typeOrmUserRepository;
    private readonly mikroOrmUserRepository;
    private readonly ormType;
    private readonly checkDb;
    private readonly checkStorage;
    private readonly checkCache;
    private readonly checkRedis;
    private readonly checkDbWithTerminus;
    constructor(dataSource: DataSource, diskHealthIndicator: DiskHealthIndicator, healthCheckService: HealthCheckService, typeOrmHealthIndicator: TypeOrmHealthIndicator, mikroOrmHealthIndicator: MikroOrmHealthIndicator, cacheHealthIndicator: CacheHealthIndicator, redisHealthIndicator: RedisHealthIndicator, typeOrmUserRepository: TypeOrmUserRepository, mikroOrmUserRepository: MikroOrmUserRepository);
    /**
     * Checks the health status of the application.
     *
     * @returns {Promise<HealthIndicatorResult>} - A promise resolving to the health check result.
     */
    getHealthStatus(): Promise<HealthCheckResult>;
    /**
     * Checks the health status of the TypeORM database.
     *
     * @param {string} uniqueLabel - The unique label for the health check.
     * @returns {Promise<HealthCheckResult>} - A promise resolving to the health check result.
     */
    private checkDatabaseTypeOrm;
    /**
     * Checks the health status of the MikroORM database.
     *
     * @param {string} uniqueLabel - The unique label for the health check.
     * @returns {Promise<HealthCheckResult>} - A promise resolving to the health check result.
     */
    private checkDatabaseMikroOrm;
}
