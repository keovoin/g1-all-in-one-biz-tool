"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const cqrs_1 = require("@nestjs/cqrs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_module_1 = require("../employee/employee.module");
const role_module_1 = require("../role/role.module");
const organization_team_employee_module_1 = require("../organization-team-employee/organization-team-employee.module");
const employee_notification_module_1 = require("../employee-notification/employee-notification.module");
const broadcast_entity_1 = require("./broadcast.entity");
const broadcast_service_1 = require("./broadcast.service");
const broadcast_controller_1 = require("./broadcast.controller");
const type_orm_broadcast_repository_1 = require("./repository/type-orm-broadcast.repository");
const mikro_orm_broadcast_repository_1 = require("./repository/mikro-orm-broadcast.repository");
const handlers_1 = require("./commands/handlers");
let BroadcastModule = class BroadcastModule {
};
exports.BroadcastModule = BroadcastModule;
exports.BroadcastModule = BroadcastModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([broadcast_entity_1.Broadcast]),
            nestjs_1.MikroOrmModule.forFeature([broadcast_entity_1.Broadcast]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            role_module_1.RoleModule,
            organization_team_employee_module_1.OrganizationTeamEmployeeModule,
            employee_notification_module_1.EmployeeNotificationModule,
        ],
        controllers: [broadcast_controller_1.BroadcastController],
        providers: [broadcast_service_1.BroadcastService, type_orm_broadcast_repository_1.TypeOrmBroadcastRepository, mikro_orm_broadcast_repository_1.MikroOrmBroadcastRepository, ...handlers_1.CommandHandlers],
        exports: [broadcast_service_1.BroadcastService, type_orm_broadcast_repository_1.TypeOrmBroadcastRepository, mikro_orm_broadcast_repository_1.MikroOrmBroadcastRepository]
    })
], BroadcastModule);
//# sourceMappingURL=broadcast.module.js.map