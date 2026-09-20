"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganizationModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const tenant_module_1 = require("../tenant/tenant.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const organization_module_1 = require("./../organization/organization.module");
const user_module_1 = require("./../user/user.module");
const employee_module_1 = require("../employee/employee.module");
const role_module_1 = require("./../role/role.module");
const user_organization_services_1 = require("./user-organization.services");
const user_organization_controller_1 = require("./user-organization.controller");
const user_organization_entity_1 = require("./user-organization.entity");
const handlers_1 = require("./commands/handlers");
const type_orm_user_organization_repository_1 = require("./repository/type-orm-user-organization.repository");
const mikro_orm_user_organization_repository_1 = require("./repository/mikro-orm-user-organization.repository");
let UserOrganizationModule = class UserOrganizationModule {
};
exports.UserOrganizationModule = UserOrganizationModule;
exports.UserOrganizationModule = UserOrganizationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([user_organization_entity_1.UserOrganization]),
            nestjs_1.MikroOrmModule.forFeature([user_organization_entity_1.UserOrganization]),
            (0, common_1.forwardRef)(() => tenant_module_1.TenantModule),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            (0, common_1.forwardRef)(() => organization_module_1.OrganizationModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => employee_module_1.EmployeeModule),
            (0, common_1.forwardRef)(() => role_module_1.RoleModule)
        ],
        controllers: [user_organization_controller_1.UserOrganizationController],
        providers: [
            user_organization_services_1.UserOrganizationService,
            type_orm_user_organization_repository_1.TypeOrmUserOrganizationRepository,
            mikro_orm_user_organization_repository_1.MikroOrmUserOrganizationRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [user_organization_services_1.UserOrganizationService, type_orm_user_organization_repository_1.TypeOrmUserOrganizationRepository, mikro_orm_user_organization_repository_1.MikroOrmUserOrganizationRepository]
    })
], UserOrganizationModule);
//# sourceMappingURL=user-organization.module.js.map