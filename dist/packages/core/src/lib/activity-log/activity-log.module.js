"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const activity_log_controller_1 = require("./activity-log.controller");
const activity_log_entity_1 = require("./activity-log.entity");
const activity_log_service_1 = require("./activity-log.service");
const handlers_1 = require("./events/handlers");
const type_orm_activity_log_repository_1 = require("./repository/type-orm-activity-log.repository");
const mikro_orm_activity_log_repository_1 = require("./repository/mikro-orm-activity-log.repository");
let ActivityLogModule = class ActivityLogModule {
};
exports.ActivityLogModule = ActivityLogModule;
exports.ActivityLogModule = ActivityLogModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([activity_log_entity_1.ActivityLog]),
            nestjs_1.MikroOrmModule.forFeature([activity_log_entity_1.ActivityLog]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [activity_log_controller_1.ActivityLogController],
        providers: [activity_log_service_1.ActivityLogService, type_orm_activity_log_repository_1.TypeOrmActivityLogRepository, mikro_orm_activity_log_repository_1.MikroOrmActivityLogRepository, ...handlers_1.EventHandlers],
        exports: [activity_log_service_1.ActivityLogService, type_orm_activity_log_repository_1.TypeOrmActivityLogRepository, mikro_orm_activity_log_repository_1.MikroOrmActivityLogRepository]
    })
], ActivityLogModule);
//# sourceMappingURL=activity-log.module.js.map