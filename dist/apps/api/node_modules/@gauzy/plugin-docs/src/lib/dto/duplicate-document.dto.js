"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateDocumentDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Payload for `POST /api/plugins/docs/documents/:id/duplicate`.
 * The copy starts `knowledgeStatus: NONE`, `reviewStatus: NONE`; versions, comments, shares,
 * links, and knowledge state are not copied.
 */
class DuplicateDocumentDTO {
}
exports.DuplicateDocumentDTO = DuplicateDocumentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], DuplicateDocumentDTO.prototype, "deep", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], DuplicateDocumentDTO.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], DuplicateDocumentDTO.prototype, "name", void 0);
//# sourceMappingURL=duplicate-document.dto.js.map