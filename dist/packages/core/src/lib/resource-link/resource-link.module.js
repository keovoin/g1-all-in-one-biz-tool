"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLinkModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_module_1 = require("../employee/employee.module");
const handlers_1 = require("./commands/handlers");
const resource_link_entity_1 = require("./resource-link.entity");
const resource_link_service_1 = require("./resource-link.service");
const resource_link_controller_1 = require("./resource-link.controller");
const type_orm_resource_link_repository_1 = require("./repository/type-orm-resource-link.repository");
const mikro_orm_resource_link_repository_1 = require("./repository/mikro-orm-resource-link.repository");
let ResourceLinkModule = class ResourceLinkModule {
};
exports.ResourceLinkModule = ResourceLinkModule;
exports.ResourceLinkModule = ResourceLinkModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([resource_link_entity_1.ResourceLink]),
            nestjs_1.MikroOrmModule.forFeature([resource_link_entity_1.ResourceLink]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            cqrs_1.CqrsModule
        ],
        controllers: [resource_link_controller_1.ResourceLinkController],
        providers: [resource_link_service_1.ResourceLinkService, type_orm_resource_link_repository_1.TypeOrmResourceLinkRepository, mikro_orm_resource_link_repository_1.MikroOrmResourceLinkRepository, ...handlers_1.CommandHandlers],
        exports: []
    })
], ResourceLinkModule);
//# sourceMappingURL=resource-link.module.js.map