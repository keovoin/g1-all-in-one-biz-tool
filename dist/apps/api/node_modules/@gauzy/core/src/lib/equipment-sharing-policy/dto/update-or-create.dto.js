"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrCreateEquipmentSharingPolicyDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const equipment_sharing_policy_entity_1 = require("../equipment-sharing-policy.entity");
/**
 * Update or Create Equipment Sharing Policy DTO
 */
class UpdateOrCreateEquipmentSharingPolicyDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.OmitType)(equipment_sharing_policy_entity_1.EquipmentSharingPolicy, ['organizationId', 'organization', 'tenant', 'tenantId']), dto_1.TenantOrganizationBaseDTO) {
}
exports.UpdateOrCreateEquipmentSharingPolicyDTO = UpdateOrCreateEquipmentSharingPolicyDTO;
//# sourceMappingURL=update-or-create.dto.js.map