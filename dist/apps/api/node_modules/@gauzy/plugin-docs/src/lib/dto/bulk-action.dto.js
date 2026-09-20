"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDocumentActionDTO = exports.DocumentBulkActionEnum = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const docs_constants_1 = require("../docs.constants");
/**
 * Bulk actions accepted by `POST /api/plugins/docs/documents/bulk`.
 *
 * M1 implements `ARCHIVE`, `UNARCHIVE`, `SET_CATEGORIES`, `ADD_TAGS`, `REMOVE_TAGS`, `MOVE`,
 * `DELETE`; the knowledge and review actions arrive with their milestones and fail per-id with
 * `DOCS_BULK_ACTION_UNSUPPORTED` until then.
 */
var DocumentBulkActionEnum;
(function (DocumentBulkActionEnum) {
    DocumentBulkActionEnum["ARCHIVE"] = "ARCHIVE";
    DocumentBulkActionEnum["UNARCHIVE"] = "UNARCHIVE";
    DocumentBulkActionEnum["SET_CATEGORIES"] = "SET_CATEGORIES";
    DocumentBulkActionEnum["ADD_TAGS"] = "ADD_TAGS";
    DocumentBulkActionEnum["REMOVE_TAGS"] = "REMOVE_TAGS";
    DocumentBulkActionEnum["KNOWLEDGE_IMPORT"] = "KNOWLEDGE_IMPORT";
    DocumentBulkActionEnum["KNOWLEDGE_EXCLUDE"] = "KNOWLEDGE_EXCLUDE";
    DocumentBulkActionEnum["MOVE"] = "MOVE";
    DocumentBulkActionEnum["DELETE"] = "DELETE";
    DocumentBulkActionEnum["REVIEW_APPROVE"] = "REVIEW_APPROVE";
    DocumentBulkActionEnum["REVIEW_REJECT"] = "REVIEW_REJECT";
})(DocumentBulkActionEnum || (exports.DocumentBulkActionEnum = DocumentBulkActionEnum = {}));
class BulkDocumentActionDTO {
}
exports.BulkDocumentActionDTO = BulkDocumentActionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array, description: 'Target document ids (≤200)' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(docs_constants_1.DOCS_BULK_MAX_IDS),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], BulkDocumentActionDTO.prototype, "ids", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: DocumentBulkActionEnum }),
    (0, class_validator_1.IsEnum)(DocumentBulkActionEnum),
    tslib_1.__metadata("design:type", String)
], BulkDocumentActionDTO.prototype, "action", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], BulkDocumentActionDTO.prototype, "categoryIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], BulkDocumentActionDTO.prototype, "tagIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((it) => it.parentId !== null),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], BulkDocumentActionDTO.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    tslib_1.__metadata("design:type", String)
], BulkDocumentActionDTO.prototype, "reason", void 0);
//# sourceMappingURL=bulk-action.dto.js.map