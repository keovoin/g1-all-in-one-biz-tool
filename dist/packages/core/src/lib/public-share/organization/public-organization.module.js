"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicOrganizationModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const internal_1 = require("./../../core/entities/internal");
const type_orm_organization_repository_1 = require("../../organization/repository/type-orm-organization.repository");
const mikro_orm_organization_repository_1 = require("../../organization/repository/mikro-orm-organization.repository");
const type_orm_organization_contact_repository_1 = require("../../organization-contact/repository/type-orm-organization-contact.repository");
const mikro_orm_organization_contact_repository_1 = require("../../organization-contact/repository/mikro-orm-organization-contact.repository");
const type_orm_organization_project_repository_1 = require("../../organization-project/repository/type-orm-organization-project.repository");
const mikro_orm_organization_project_repository_1 = require("../../organization-project/repository/mikro-orm-organization-project.repository");
const public_organization_controller_1 = require("./public-organization.controller");
const public_organization_service_1 = require("./public-organization.service");
const handlers_1 = require("./queries/handlers");
let PublicOrganizationModule = class PublicOrganizationModule {
};
exports.PublicOrganizationModule = PublicOrganizationModule;
exports.PublicOrganizationModule = PublicOrganizationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([internal_1.Organization, internal_1.OrganizationContact, internal_1.OrganizationProject]),
            nestjs_1.MikroOrmModule.forFeature([internal_1.Organization, internal_1.OrganizationContact, internal_1.OrganizationProject])
        ],
        controllers: [public_organization_controller_1.PublicOrganizationController],
        providers: [
            public_organization_service_1.PublicOrganizationService,
            type_orm_organization_repository_1.TypeOrmOrganizationRepository,
            mikro_orm_organization_repository_1.MikroOrmOrganizationRepository,
            type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository,
            mikro_orm_organization_contact_repository_1.MikroOrmOrganizationContactRepository,
            type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository,
            mikro_orm_organization_project_repository_1.MikroOrmOrganizationProjectRepository,
            ...handlers_1.QueryHandlers
        ]
    })
], PublicOrganizationModule);
//# sourceMappingURL=public-organization.module.js.map