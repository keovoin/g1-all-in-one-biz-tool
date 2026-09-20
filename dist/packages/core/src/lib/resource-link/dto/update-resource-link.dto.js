"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResourceLinkDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_resource_link_dto_1 = require("./create-resource-link.dto");
/**
 * Create ResourceLink data validation request DTO
 */
class UpdateResourceLinkDTO extends (0, swagger_1.PartialType)(create_resource_link_dto_1.CreateResourceLinkDTO) {
}
exports.UpdateResourceLinkDTO = UpdateResourceLinkDTO;
//# sourceMappingURL=update-resource-link.dto.js.map