"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReprocessDocumentDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Body of `POST /api/plugins/docs/documents/:id/reprocess` — re-runs the pipeline from
 * `docs.extract` for a FILE document.
 *
 * `extractedTextEdited && !overwriteEdited` → 409 `DOCS_EXTRACTED_TEXT_EDITED` (a human
 * correction is never silently overwritten). `ocr: true` requests the OCR path (P1,
 * delivered M5, env-gated).
 */
class ReprocessDocumentDTO {
}
exports.ReprocessDocumentDTO = ReprocessDocumentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ReprocessDocumentDTO.prototype, "force", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ReprocessDocumentDTO.prototype, "ocr", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ReprocessDocumentDTO.prototype, "overwriteEdited", void 0);
//# sourceMappingURL=reprocess-document.dto.js.map