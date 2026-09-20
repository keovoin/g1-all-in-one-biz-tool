"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const path = require("node:path");
const utils_1 = require("../core/utils");
const cache_health_indicator_1 = require("./indicators/cache-health.indicator");
const redis_health_indicator_1 = require("./indicators/redis-health.indicator");
const type_orm_user_repository_1 = require("../user/repository/type-orm-user.repository");
const mikro_orm_user_repository_1 = require("../user/repository/mikro-orm-user.repository");
let HealthService = class HealthService {
    constructor(dataSource, diskHealthIndicator, healthCheckService, typeOrmHealthIndicator, mikroOrmHealthIndicator, cacheHealthIndicator, redisHealthIndicator, typeOrmUserRepository, mikroOrmUserRepository) {
        this.dataSource = dataSource;
        this.diskHealthIndicator = diskHealthIndicator;
        this.healthCheckService = healthCheckService;
        this.typeOrmHealthIndicator = typeOrmHealthIndicator;
        this.mikroOrmHealthIndicator = mikroOrmHealthIndicator;
        this.cacheHealthIndicator = cacheHealthIndicator;
        this.redisHealthIndicator = redisHealthIndicator;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.mikroOrmUserRepository = mikroOrmUserRepository;
        this.checkDb = true;
        this.checkStorage = true;
        this.checkCache = true;
        this.checkRedis = true;
        // Note: we disable by default because we notice some connection
        // related issues with Terminus DB checks (in MikroORM)
        this.checkDbWithTerminus = false;
        this.ormType = (0, utils_1.getORMType)();
    }
    /**
     * Checks the health status of the application.
     *
     * @returns {Promise<HealthIndicatorResult>} - A promise resolving to the health check result.
     */
    async getHealthStatus() {
        const uniqueLabel = `HealthCheckExecutionTimer-${(0, uuid_1.v4)()}`;
        console.log('Health check started: ', uniqueLabel);
        console.time(uniqueLabel);
        const checks = [];
        if (this.checkDb) {
            checks.push(async () => {
                console.log(`Checking ${uniqueLabel} Database...`);
                if (this.ormType === utils_1.MultiORMEnum.TypeORM) {
                    return await this.checkDatabaseTypeOrm(uniqueLabel);
                }
                if (this.ormType === utils_1.MultiORMEnum.MikroORM) {
                    return await this.checkDatabaseMikroOrm(uniqueLabel);
                }
                throw new Error('ORM not supported');
            });
        }
        if (this.checkStorage) {
            checks.push(async () => {
                console.log(`Checking ${uniqueLabel} Storage...`);
                try {
                    const currentPath = path.resolve(__dirname);
                    console.log(`Checking ${uniqueLabel} Storage at path: ${currentPath}`);
                    const resStorage = await this.diskHealthIndicator.checkStorage('storage', {
                        path: currentPath,
                        // basically will fail if disk is full
                        thresholdPercent: 99.999999
                    });
                    console.log(`Storage check ${uniqueLabel} completed`);
                    return resStorage;
                }
                catch (err) {
                    console.error(`Storage check ${uniqueLabel} failed`, err);
                    return {
                        disk: {
                            status: 'down',
                            message: err.message
                        }
                    };
                }
            });
        }
        if (this.checkCache) {
            checks.push(async () => {
                console.log(`Checking ${uniqueLabel} Cache...`);
                const resCache = await this.cacheHealthIndicator.isHealthy('cache');
                console.log(`Cache check ${uniqueLabel} completed`);
                return resCache;
            });
        }
        if (this.checkRedis) {
            if (process.env.REDIS_ENABLED === 'true') {
                checks.push(async () => {
                    console.log(`Checking ${uniqueLabel} Redis...`);
                    const resRedis = await this.redisHealthIndicator.isHealthy('redis');
                    console.log(`Redis check ${uniqueLabel} completed`);
                    return resRedis;
                });
            }
        }
        const result = await this.healthCheckService.check(checks);
        console.timeEnd(uniqueLabel);
        console.log(`Health check ${uniqueLabel} result: ${JSON.stringify(result)}`);
        return result;
    }
    /**
     * Checks the health status of the TypeORM database.
     *
     * @param {string} uniqueLabel - The unique label for the health check.
     * @returns {Promise<HealthCheckResult>} - A promise resolving to the health check result.
     */
    async checkDatabaseTypeOrm(uniqueLabel) {
        let queryRunner;
        try {
            let message;
            if (this.checkDbWithTerminus) {
                queryRunner = this.dataSource.createQueryRunner();
                const resDatabase = await this.typeOrmHealthIndicator.pingCheck('database', {
                    connection: queryRunner.dataSource,
                    timeout: 60000
                });
                message = resDatabase?.database?.message;
            }
            const usersCount = await this.typeOrmUserRepository.count();
            console.log(`Database (TypeORM) users count ${uniqueLabel} is: ${usersCount}`);
            console.log(`Database (TypeORM) check ${uniqueLabel} completed`);
            return {
                database: {
                    status: 'up',
                    message
                }
            };
        }
        catch (err) {
            console.error(`Database (TypeORM) check ${uniqueLabel} failed`, err);
            return {
                database: {
                    status: 'down',
                    message: err.message
                }
            };
        }
        finally {
            if (this.checkDbWithTerminus && queryRunner)
                await queryRunner.release();
        }
    }
    /**
     * Checks the health status of the MikroORM database.
     *
     * @param {string} uniqueLabel - The unique label for the health check.
     * @returns {Promise<HealthCheckResult>} - A promise resolving to the health check result.
     */
    async checkDatabaseMikroOrm(uniqueLabel) {
        try {
            let message;
            if (this.checkDbWithTerminus) {
                const resDatabase = await this.mikroOrmHealthIndicator.pingCheck('database', {
                    timeout: 60000
                });
                message = resDatabase?.database?.message;
            }
            const usersCount = await this.mikroOrmUserRepository.count();
            console.log(`Database (MikroORM) users count ${uniqueLabel} is: ${usersCount}`);
            console.log(`Database (MikroORM) check ${uniqueLabel} completed`);
            return {
                database: {
                    status: 'up',
                    message
                }
            };
        }
        catch (err) {
            console.error(`Database (MikroORM) check ${uniqueLabel} failed`, err);
            return {
                database: {
                    status: 'down',
                    message: err.message
                }
            };
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectDataSource)()),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.DataSource,
        terminus_1.DiskHealthIndicator,
        terminus_1.HealthCheckService,
        terminus_1.TypeOrmHealthIndicator,
        terminus_1.MikroOrmHealthIndicator,
        cache_health_indicator_1.CacheHealthIndicator,
        redis_health_indicator_1.RedisHealthIndicator,
        type_orm_user_repository_1.TypeOrmUserRepository,
        mikro_orm_user_repository_1.MikroOrmUserRepository])
], HealthService);
//# sourceMappingURL=health.service.js.map