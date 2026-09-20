"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExtractedTextDTO = exports.EXTRACTED_TEXT_MAX_LENGTH = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/** 5 MiB cap on a human-corrected extraction (matches the pipeline extraction cap). */
exports.EXTRACTED_TEXT_MAX_LENGTH = 5 * 1024 * 1024;
/**
 * Body of `PUT /api/plugins/docs/documents/:id/extracted-text` — the human correction
 * flow: stores the markdown, sets `extractedTextEdited: true` (permanently protects it
 * from pipeline overwrite), forces `status: READY`, and re-enqueues from `docs.chunk`
 * when the document is in knowledge.
 */
class UpdateExtractedTextDTO {
}
exports.UpdateExtractedTextDTO = UpdateExtractedTextDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'The corrected extraction markdown (≤ 5 MiB)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(exports.EXTRACTED_TEXT_MAX_LENGTH),
    tslib_1.__metadata("design:type", String)
], UpdateExtractedTextDTO.prototype, "extractedText", void 0);
//# sourceMappingURL=update-extracted-text.dto.js.map