"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDocumentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const type_orm_organization_document_repository_1 = require("./repository/type-orm-organization-document.repository");
const mikro_orm_organization_document_repository_1 = require("./repository/mikro-orm-organization-document.repository");
let OrganizationDocumentService = class OrganizationDocumentService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationDocumentRepository, mikroOrmOrganizationDocumentRepository) {
        super(typeOrmOrganizationDocumentRepository, mikroOrmOrganizationDocumentRepository);
    }
};
exports.OrganizationDocumentService = OrganizationDocumentService;
exports.OrganizationDocumentService = OrganizationDocumentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_document_repository_1.TypeOrmOrganizationDocumentRepository,
        mikro_orm_organization_document_repository_1.MikroOrmOrganizationDocumentRepository])
], OrganizationDocumentService);
//# sourceMappingURL=organization-document.service.js.map