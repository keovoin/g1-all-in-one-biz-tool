"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContactModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_contact_entity_1 = require("./organization-contact.entity");
const organization_contact_controller_1 = require("./organization-contact.controller");
const organization_contact_service_1 = require("./organization-contact.service");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const organization_module_1 = require("./../organization/organization.module");
const organization_project_module_1 = require("./../organization-project/organization-project.module");
const contact_module_1 = require("../contact/contact.module");
const type_orm_organization_contact_repository_1 = require("./repository/type-orm-organization-contact.repository");
const mikro_orm_organization_contact_repository_1 = require("./repository/mikro-orm-organization-contact.repository");
let OrganizationContactModule = class OrganizationContactModule {
};
exports.OrganizationContactModule = OrganizationContactModule;
exports.OrganizationContactModule = OrganizationContactModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_contact_entity_1.OrganizationContact]),
            nestjs_1.MikroOrmModule.forFeature([organization_contact_entity_1.OrganizationContact]),
            role_permission_module_1.RolePermissionModule,
            organization_module_1.OrganizationModule,
            organization_project_module_1.OrganizationProjectModule,
            contact_module_1.ContactModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_contact_controller_1.OrganizationContactController],
        providers: [organization_contact_service_1.OrganizationContactService, type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository, mikro_orm_organization_contact_repository_1.MikroOrmOrganizationContactRepository, ...handlers_1.CommandHandlers],
        exports: [organization_contact_service_1.OrganizationContactService, type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository, mikro_orm_organization_contact_repository_1.MikroOrmOrganizationContactRepository]
    })
], OrganizationContactModule);
//# sourceMappingURL=organization-contact.module.js.map