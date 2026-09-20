import { IEquipmentSharingPolicy } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { EquipmentSharingPolicy } from '../equipment-sharing-policy.entity';
declare const UpdateOrCreateEquipmentSharingPolicyDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<EquipmentSharingPolicy, "tenantId" | "tenant" | "organization" | "organizationId">>;
/**
 * Update or Create Equipment Sharing Policy DTO
 */
export declare class UpdateOrCreateEquipmentSharingPolicyDTO extends UpdateOrCreateEquipmentSharingPolicyDTO_base implements IEquipmentSharingPolicy {
}
export {};
