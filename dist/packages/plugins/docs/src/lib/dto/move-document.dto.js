"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDocumentDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Payload for `POST /api/plugins/docs/documents/:id/move`.
 * `parentId: null` = move to root; sibling `index` values are compacted after insert.
 */
class MoveDocumentDTO {
}
exports.MoveDocumentDTO = MoveDocumentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, nullable: true, description: 'New parent id; null = root' }),
    (0, class_validator_1.ValidateIf)((it) => it.parentId !== null),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], MoveDocumentDTO.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Target sibling position' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], MoveDocumentDTO.prototype, "index", void 0);
//# sourceMappingURL=move-document.dto.js.map