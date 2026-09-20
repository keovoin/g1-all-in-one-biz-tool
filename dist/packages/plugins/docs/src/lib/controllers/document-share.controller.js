"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentShareController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const document_share_dto_1 = require("../dto/document-share.dto");
const document_share_entity_1 = require("../entities/document-share.entity");
const document_share_service_1 = require("../services/document-share.service");
/**
 * The share overlay of PRIVATE documents (`03-backend-plugin.md` §4.12).
 *
 * Guards prove the verb (`DOCS_READ` to list, `DOCS_UPDATE` to mutate); the service proves
 * the verb is allowed on this row — creator-or-`DOCS_MANAGE` only, PRIVATE documents only.
 * A document the caller cannot read is a 404, never a 403.
 */
let DocumentShareController = class DocumentShareController {
    constructor(documentShareService) {
        this.documentShareService = documentShareService;
    }
    /**
     * Lists the share overlay of one document (creator / `DOCS_MANAGE` only).
     */
    async findAll(id) {
        return this.documentShareService.findAllForDocument(id);
    }
    /**
     * Shares a PRIVATE document with one employee XOR one team.
     */
    async create(id, input) {
        return this.documentShareService.createShare(id, input);
    }
    /**
     * Changes the access level of one share row.
     */
    async update(id, shareId, input) {
        return this.documentShareService.updateShare(id, shareId, input);
    }
    /**
     * Revokes one share row.
     */
    async delete(id, shareId) {
        return this.documentShareService.deleteShare(id, shareId);
    }
};
exports.DocumentShareController = DocumentShareController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List the shares of one document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Shares retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Not the creator and not a DOCS_MANAGE holder.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found or not readable.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, common_1.Get)('/documents/:id/shares'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentShareController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Share a PRIVATE document with an employee or a team.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Share created successfully.', type: document_share_entity_1.DocumentShare }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Both or neither of employeeId/teamId supplied.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Document is not PRIVATE, or the share already exists.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/documents/:id/shares'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, document_share_dto_1.CreateDocumentShareDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentShareController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update the access level of a document share.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Share updated successfully.', type: document_share_entity_1.DocumentShare }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Share not found on this document.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Put)('/documents/:id/shares/:shareId'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('shareId', core_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, document_share_dto_1.UpdateDocumentShareDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentShareController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Revoke a document share.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Share revoked successfully.', type: document_share_entity_1.DocumentShare }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Share not found on this document.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, common_1.Delete)('/documents/:id/shares/:shareId'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('shareId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentShareController.prototype, "delete", null);
exports.DocumentShareController = DocumentShareController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs'),
    tslib_1.__metadata("design:paramtypes", [document_share_service_1.DocumentShareService])
], DocumentShareController);
//# sourceMappingURL=document-share.controller.js.map