"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentLinkController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const create_document_link_command_1 = require("../commands/create-document-link.command");
const delete_document_link_command_1 = require("../commands/delete-document-link.command");
const dto_1 = require("../dto");
const document_link_entity_1 = require("../entities/document-link.entity");
const get_document_links_query_1 = require("../queries/get-document-links.query");
let DocumentLinkController = class DocumentLinkController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * The "Documents panel" query for business records — every link attached to
     * (`entity`, `entityId`), with embedded document list projections.
     */
    async findForEntity(query) {
        return this.queryBus.execute(new get_document_links_query_1.GetDocumentLinksQuery({
            entity: query.entity,
            entityId: query.entityId,
            organizationId: query.organizationId
        }));
    }
    /**
     * Idempotent link write on `(documentId, entity, entityId)` — a duplicate returns the
     * existing row with 200.
     */
    async create(input) {
        return this.commandBus.execute(new create_document_link_command_1.CreateDocumentLinkCommand(input));
    }
    /**
     * Removes a link.
     */
    async delete(id) {
        return this.commandBus.execute(new delete_document_link_command_1.DeleteDocumentLinkCommand(id));
    }
    /**
     * The reverse direction: everything one document is attached to.
     *
     * `organizationId` is the client's selected organization — the document read behind this
     * route otherwise falls back to the token's org, which is null for non-employee users (400)
     * and stale when the client browses another organization of the tenant (404).
     */
    async findForDocument(id, query) {
        return this.queryBus.execute(new get_document_links_query_1.GetDocumentLinksQuery({ documentId: id, organizationId: query?.organizationId }));
    }
};
exports.DocumentLinkController = DocumentLinkController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List links attached to one business record.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Links retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/links'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GetDocumentLinksQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentLinkController.prototype, "findForEntity", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Attach a document to a business record.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Link created (or already existed).', type: document_link_entity_1.DocumentLink }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/links'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateDocumentLinkDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentLinkController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Detach a document link.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Link deleted successfully.', type: document_link_entity_1.DocumentLink }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Link not found.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, common_1.Delete)('/links/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentLinkController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List everything one document is linked to.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Links retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/documents/:id/links'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.DocumentScopeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentLinkController.prototype, "findForDocument", null);
exports.DocumentLinkController = DocumentLinkController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], DocumentLinkController);
//# sourceMappingURL=document-link.controller.js.map