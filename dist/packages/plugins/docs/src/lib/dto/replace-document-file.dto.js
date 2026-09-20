"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceDocumentFileDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Normalizes a multipart text part into a boolean (`'true'`/`'1'` → true).
 */
const toBoolean = ({ value }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    return ['true', '1', 'yes'].includes(String(value).toLowerCase());
};
/**
 * Form fields accompanying the single file of `POST /api/plugins/docs/documents/:id/file`
 * (R-UPL-05, replace-in-place).
 *
 * The document already exists, so nothing that identifies or classifies it is accepted here:
 * name, parent, visibility, categories, tags, links, comments and favorites are all preserved
 * by definition. The one decision left to the caller is whether the re-run may spend AI on
 * re-classification.
 */
class ReplaceDocumentFileDTO {
}
exports.ReplaceDocumentFileDTO = ReplaceDocumentFileDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(toBoolean),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ReplaceDocumentFileDTO.prototype, "classifyWithAi", void 0);
//# sourceMappingURL=replace-document-file.dto.js.map