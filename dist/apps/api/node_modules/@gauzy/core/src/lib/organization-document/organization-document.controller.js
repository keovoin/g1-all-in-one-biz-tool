"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDocumentController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const organization_document_entity_1 = require("./organization-document.entity");
const organization_document_service_1 = require("./organization-document.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
let OrganizationDocumentController = class OrganizationDocumentController extends crud_1.CrudController {
    constructor(organizationDocumentService) {
        super(organizationDocumentService);
        this.organizationDocumentService = organizationDocumentService;
    }
    /**
     * GET all organization documents
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { findInput } = data;
        return this.organizationDocumentService.findAll({ where: findInput });
    }
};
exports.OrganizationDocumentController = OrganizationDocumentController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization document.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization document',
        type: organization_document_entity_1.OrganizationDocument
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationDocumentController.prototype, "findAll", null);
exports.OrganizationDocumentController = OrganizationDocumentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationDocument'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/organization-documents'),
    tslib_1.__metadata("design:paramtypes", [organization_document_service_1.OrganizationDocumentService])
], OrganizationDocumentController);
//# sourceMappingURL=organization-document.controller.js.map