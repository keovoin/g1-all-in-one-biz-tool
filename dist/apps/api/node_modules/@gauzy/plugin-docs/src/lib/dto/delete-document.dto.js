"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Query params for `DELETE /api/plugins/docs/documents/:id`.
 * `subtree` (default) soft-deletes the descendants too; `promote-children` re-parents children
 * to the deleted node's parent, preserving relative `index` order.
 */
class DeleteDocumentQueryDTO {
}
exports.DeleteDocumentQueryDTO = DeleteDocumentQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: ['subtree', 'promote-children'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['subtree', 'promote-children']),
    tslib_1.__metadata("design:type", String)
], DeleteDocumentQueryDTO.prototype, "strategy", void 0);
//# sourceMappingURL=delete-document.dto.js.map