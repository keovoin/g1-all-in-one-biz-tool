"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthModule = void 0;
const tslib_1 = require("tslib");
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const typeorm_1 = require("@nestjs/typeorm");
const health_controller_1 = require("./health.controller");
const health_service_1 = require("./health.service");
const cache_health_indicator_1 = require("./indicators/cache-health.indicator");
const redis_health_indicator_1 = require("./indicators/redis-health.indicator");
const mikro_orm_user_repository_1 = require("../user/repository/mikro-orm-user.repository");
const type_orm_user_repository_1 = require("../user/repository/type-orm-user.repository");
const user_entity_1 = require("../user/user.entity");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            nestjs_1.MikroOrmModule.forFeature([user_entity_1.User]),
            terminus_1.TerminusModule.forRoot({
                logger: common_1.ConsoleLogger
                // https://docs.nestjs.com/recipes/terminus#graceful-shutdown-timeout
                // gracefulShutdownTimeoutMs: 1000
            })
        ],
        providers: [
            health_service_1.HealthService,
            cache_health_indicator_1.CacheHealthIndicator,
            redis_health_indicator_1.RedisHealthIndicator,
            type_orm_user_repository_1.TypeOrmUserRepository,
            mikro_orm_user_repository_1.MikroOrmUserRepository
        ]
    })
], HealthModule);
//# sourceMappingURL=health.module.js.map