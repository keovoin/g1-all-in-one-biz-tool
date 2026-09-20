"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_comment_dto_1 = require("./create-comment.dto");
/**
 * Update Comment data validation request DTO
 */
class UpdateCommentDTO extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_comment_dto_1.CreateCommentDTO, ['entity', 'entityId'])) {
}
exports.UpdateCommentDTO = UpdateCommentDTO;
//# sourceMappingURL=update-comment.dto.js.map