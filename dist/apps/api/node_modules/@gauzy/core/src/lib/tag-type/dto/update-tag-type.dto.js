"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTagTypeDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tag_type_dto_1 = require("./create-tag-type.dto");
/**
 * DTO for updating a Tag Type
 */
class UpdateTagTypeDTO extends (0, swagger_1.PartialType)(create_tag_type_dto_1.CreateTagTypeDTO) {
}
exports.UpdateTagTypeDTO = UpdateTagTypeDTO;
//# sourceMappingURL=update-tag-type.dto.js.map