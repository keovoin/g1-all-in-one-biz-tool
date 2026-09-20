"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationBonusesDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const organization_entity_1 = require("../organization.entity");
/**
 * Organization Bonuses DTO validation
 */
class OrganizationBonusesDTO extends (0, swagger_1.PickType)(organization_entity_1.Organization, ['bonusPercentage', 'bonusType']) {
}
exports.OrganizationBonusesDTO = OrganizationBonusesDTO;
//# sourceMappingURL=organization-bonuses.dto.js.map