"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSharedEntityDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const shared_entity_entity_1 = require("../shared-entity.entity");
/**
 * Update Shared Entity DTO
 */
class UpdateSharedEntityDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(shared_entity_entity_1.SharedEntity, ['token', 'entity', 'entityId'])) {
}
exports.UpdateSharedEntityDTO = UpdateSharedEntityDTO;
//# sourceMappingURL=update-shared-entity.dto.js.map