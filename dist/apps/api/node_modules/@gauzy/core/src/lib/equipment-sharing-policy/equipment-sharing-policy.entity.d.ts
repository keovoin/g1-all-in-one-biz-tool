import { IEquipmentSharing, IEquipmentSharingPolicy } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EquipmentSharingPolicy extends TenantOrganizationBaseEntity implements IEquipmentSharingPolicy {
    name: string;
    description: string;
    /**
     * EquipmentSharing
     */
    equipmentSharings?: IEquipmentSharing[];
}
