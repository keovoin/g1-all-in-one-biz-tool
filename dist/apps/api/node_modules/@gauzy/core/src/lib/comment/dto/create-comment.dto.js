"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const dto_2 = require("../../mention/dto");
const comment_entity_1 = require("../comment.entity");
/**
 * Create Comment data validation request DTO
 */
class CreateCommentDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, comment_entity_1.Comment, dto_2.MentionEmployeeIdsDTO) {
}
exports.CreateCommentDTO = CreateCommentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommentDTO.prototype, "entityName", void 0);
//# sourceMappingURL=create-comment.dto.js.map