"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResourceLinkDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const resource_link_entity_1 = require("../resource-link.entity");
/**
 * Create ResourceLink data validation request DTO
 */
class CreateResourceLinkDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, resource_link_entity_1.ResourceLink) {
}
exports.CreateResourceLinkDTO = CreateResourceLinkDTO;
//# sourceMappingURL=create-resource-link.dto.js.map