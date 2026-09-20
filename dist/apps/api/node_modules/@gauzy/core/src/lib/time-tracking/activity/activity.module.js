"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const employee_module_1 = require("./../../employee/employee.module");
const organization_project_module_1 = require("./../../organization-project/organization-project.module");
const handlers_1 = require("./commands/handlers");
const activity_controller_1 = require("./activity.controller");
const activity_service_1 = require("./activity.service");
const activity_entity_1 = require("./activity.entity");
const activity_map_service_1 = require("./activity.map.service");
const time_slot_module_1 = require("./../time-slot/time-slot.module");
const type_orm_activity_repository_1 = require("./repository/type-orm-activity.repository");
const mikro_orm_activity_repository_1 = require("./repository/mikro-orm-activity.repository");
let ActivityModule = class ActivityModule {
};
exports.ActivityModule = ActivityModule;
exports.ActivityModule = ActivityModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [activity_controller_1.ActivityController],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([activity_entity_1.Activity]),
            nestjs_1.MikroOrmModule.forFeature([activity_entity_1.Activity]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            organization_project_module_1.OrganizationProjectModule,
            (0, common_1.forwardRef)(() => time_slot_module_1.TimeSlotModule),
            cqrs_1.CqrsModule
        ],
        providers: [activity_service_1.ActivityService, activity_map_service_1.ActivityMapService, type_orm_activity_repository_1.TypeOrmActivityRepository, mikro_orm_activity_repository_1.MikroOrmActivityRepository, ...handlers_1.CommandHandlers],
        exports: [activity_service_1.ActivityService, activity_map_service_1.ActivityMapService, type_orm_activity_repository_1.TypeOrmActivityRepository, mikro_orm_activity_repository_1.MikroOrmActivityRepository]
    })
], ActivityModule);
//# sourceMappingURL=activity.module.js.map