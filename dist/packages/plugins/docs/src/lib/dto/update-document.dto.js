"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_document_dto_1 = require("./create-document.dto");
/**
 * Partial **metadata-only** update for `PUT /api/plugins/docs/documents/:id`.
 *
 * `kind` is immutable and content saves go through `PUT /:id/content` — the content fields are
 * omitted here so `forbidNonWhitelisted` rejects them with 400.
 *
 * `parentId` and `index` are omitted for the same reason: re-parenting is a **tree** operation
 * and belongs exclusively to `POST /:id/move`, which is cycle-guarded and rejects a FILE parent.
 * Writing `parentId` straight through this endpoint bypassed both guards and could build a
 * cycle that the ancestor walks then had to survive.
 */
class UpdateDocumentDTO extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_document_dto_1.CreateDocumentDTO, [
    'kind',
    'contentJson',
    'contentHtml',
    'importToKnowledge',
    'parentId',
    'index'
])) {
}
exports.UpdateDocumentDTO = UpdateDocumentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateDocumentDTO.prototype, "searchable", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateDocumentDTO.prototype, "isLocked", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateDocumentDTO.prototype, "summary", void 0);
//# sourceMappingURL=update-document.dto.js.map