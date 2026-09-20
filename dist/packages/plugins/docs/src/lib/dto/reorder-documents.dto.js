"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderDocumentsDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Payload for `POST /api/plugins/docs/documents/reorder` — rewrites `index` for the listed
 * siblings. Ids that are not children of `parentId` yield 400 `DOCS_REORDER_MIXED_PARENTS`.
 */
class ReorderDocumentsDTO {
}
exports.ReorderDocumentsDTO = ReorderDocumentsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, nullable: true, description: 'Parent id; null = root siblings' }),
    (0, class_validator_1.ValidateIf)((it) => it.parentId !== null),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ReorderDocumentsDTO.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array, description: 'Sibling ids in the desired order' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], ReorderDocumentsDTO.prototype, "orderedIds", void 0);
//# sourceMappingURL=reorder-documents.dto.js.map