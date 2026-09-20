"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReactionDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const reaction_entity_1 = require("../reaction.entity");
const dto_1 = require("../../core/dto");
/**
 * Update Reaction data validation request DTO
 */
class UpdateReactionDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(reaction_entity_1.Reaction, ['emoji'])) {
}
exports.UpdateReactionDTO = UpdateReactionDTO;
//# sourceMappingURL=update-reaction.dto.js.map