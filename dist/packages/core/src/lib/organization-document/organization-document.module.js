"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDocumentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_document_entity_1 = require("./organization-document.entity");
const organization_document_service_1 = require("./organization-document.service");
const organization_document_controller_1 = require("./organization-document.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_organization_document_repository_1 = require("./repository/type-orm-organization-document.repository");
const mikro_orm_organization_document_repository_1 = require("./repository/mikro-orm-organization-document.repository");
let OrganizationDocumentModule = class OrganizationDocumentModule {
};
exports.OrganizationDocumentModule = OrganizationDocumentModule;
exports.OrganizationDocumentModule = OrganizationDocumentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_document_entity_1.OrganizationDocument]),
            nestjs_1.MikroOrmModule.forFeature([organization_document_entity_1.OrganizationDocument]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [organization_document_controller_1.OrganizationDocumentController],
        providers: [organization_document_service_1.OrganizationDocumentService, type_orm_organization_document_repository_1.TypeOrmOrganizationDocumentRepository, mikro_orm_organization_document_repository_1.MikroOrmOrganizationDocumentRepository]
    })
], OrganizationDocumentModule);
//# sourceMappingURL=organization-document.module.js.map