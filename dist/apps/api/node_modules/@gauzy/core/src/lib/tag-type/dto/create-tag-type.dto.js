"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTagTypeDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const tag_type_entity_1 = require("../tag-type.entity");
/**
 * DTO for creating a Tag Type
 */
class CreateTagTypeDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(tag_type_entity_1.TagType, ['type', 'tags']) // Only pick fields once
) {
}
exports.CreateTagTypeDTO = CreateTagTypeDTO;
//# sourceMappingURL=create-tag-type.dto.js.map