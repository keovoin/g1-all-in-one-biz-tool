"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizationStrategicInitiativeDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const organization_strategic_initiative_entity_1 = require("../organization-strategic-initiative.entity");
/**
 * Create Organization Strategic Initiative data validation request DTO
 */
class CreateOrganizationStrategicInitiativeDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(organization_strategic_initiative_entity_1.OrganizationStrategicInitiative, ['steward', 'goals', 'projects'])) {
}
exports.CreateOrganizationStrategicInitiativeDTO = CreateOrganizationStrategicInitiativeDTO;
//# sourceMappingURL=create-organization-strategic-initiative.dto.js.map