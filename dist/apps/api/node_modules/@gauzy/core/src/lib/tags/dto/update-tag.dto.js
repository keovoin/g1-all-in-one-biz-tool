"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTagDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tag_dto_1 = require("./create-tag.dto");
class UpdateTagDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(create_tag_dto_1.CreateTagDTO)) {
}
exports.UpdateTagDTO = UpdateTagDTO;
//# sourceMappingURL=update-tag.dto.js.map