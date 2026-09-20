"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const event_type_entity_1 = require("./event-type.entity");
const event_type_service_1 = require("./event-type.service");
const event_type_controller_1 = require("./event-type.controller");
const handlers_1 = require("./commands/handlers");
const employee_module_1 = require("../employee/employee.module");
const organization_module_1 = require("../organization/organization.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_event_types_repository_1 = require("./repository/type-orm-event-types.repository");
const mikro_orm_event_type_repository_1 = require("./repository/mikro-orm-event-type.repository");
let EventTypeModule = class EventTypeModule {
};
exports.EventTypeModule = EventTypeModule;
exports.EventTypeModule = EventTypeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([event_type_entity_1.EventType]),
            nestjs_1.MikroOrmModule.forFeature([event_type_entity_1.EventType]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            organization_module_1.OrganizationModule,
            cqrs_1.CqrsModule
        ],
        controllers: [event_type_controller_1.EventTypeController],
        providers: [event_type_service_1.EventTypeService, type_orm_event_types_repository_1.TypeOrmEventTypeRepository, mikro_orm_event_type_repository_1.MikroOrmEventTypeRepository, ...handlers_1.CommandHandlers]
    })
], EventTypeModule);
//# sourceMappingURL=event-type.module.js.map