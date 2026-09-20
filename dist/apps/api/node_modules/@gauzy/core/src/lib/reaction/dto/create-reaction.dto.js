"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReactionDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../core/dto");
const reaction_entity_1 = require("../reaction.entity");
/**
 * Create Reaction data validation request DTO.
 *
 * This DTO combines:
 * - TenantOrganizationBaseDTO: provides tenant and organization-related properties.
 * - A selection of properties from Reaction (entity, entityId, and emoji).
 *
 * The resulting class implements IReactionCreateInput.
 */
class CreateReactionDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(reaction_entity_1.Reaction, ['entity', 'entityId', 'emoji'])) {
}
exports.CreateReactionDTO = CreateReactionDTO;
//# sourceMappingURL=create-reaction.dto.js.map