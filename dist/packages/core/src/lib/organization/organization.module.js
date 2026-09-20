"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const user_organization_module_1 = require("../user-organization/user-organization.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const contact_module_1 = require("../contact/contact.module");
const user_module_1 = require("./../user/user.module");
const handlers_1 = require("./commands/handlers");
const organization_controller_1 = require("./organization.controller");
const organization_entity_1 = require("./organization.entity");
const organization_service_1 = require("./organization.service");
const type_orm_organization_repository_1 = require("./repository/type-orm-organization.repository");
const mikro_orm_organization_repository_1 = require("./repository/mikro-orm-organization.repository");
let OrganizationModule = class OrganizationModule {
};
exports.OrganizationModule = OrganizationModule;
exports.OrganizationModule = OrganizationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_entity_1.Organization]),
            nestjs_1.MikroOrmModule.forFeature([organization_entity_1.Organization]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            (0, common_1.forwardRef)(() => user_organization_module_1.UserOrganizationModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            contact_module_1.ContactModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_controller_1.OrganizationController],
        providers: [organization_service_1.OrganizationService, type_orm_organization_repository_1.TypeOrmOrganizationRepository, mikro_orm_organization_repository_1.MikroOrmOrganizationRepository, ...handlers_1.CommandHandlers],
        exports: [organization_service_1.OrganizationService, type_orm_organization_repository_1.TypeOrmOrganizationRepository, mikro_orm_organization_repository_1.MikroOrmOrganizationRepository]
    })
], OrganizationModule);
//# sourceMappingURL=organization.module.js.map