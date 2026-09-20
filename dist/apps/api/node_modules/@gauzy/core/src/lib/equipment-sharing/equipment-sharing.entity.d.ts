import { ID, IEmployee, IEquipment, IEquipmentSharing, IEquipmentSharingPolicy, IOrganizationTeam } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EquipmentSharing extends TenantOrganizationBaseEntity implements IEquipmentSharing {
    /**
     * Represents the name of the equipment sharing record.
     * This optional string field may be used to label or identify the sharing entry.
     */
    name: string;
    /**
     * Represents the date when the share request was initiated.
     * This optional field captures the moment a sharing request was made.
     */
    shareRequestDay: Date;
    /**
     * Represents the starting date of the equipment sharing period.
     * This optional field indicates when the sharing period begins.
     */
    shareStartDay: Date;
    /**
     * Represents the ending date of the equipment sharing period.
     * This optional field indicates when the sharing period ends.
     */
    shareEndDay: Date;
    /**
     * Represents the status of the equipment sharing record.
     * This mandatory numeric field is used to reflect the current state or phase of the sharing process.
     */
    status: number;
    /**
     * The equipment for which this sharing is created.
     */
    equipment: IEquipment;
    /**
     * The ID unique identifier of the equipment.
     */
    equipmentId: ID;
    /**
     * Equipment
     */
    equipmentSharingPolicy: IEquipmentSharingPolicy;
    /**
     * The ID unique identifier of the equipment sharing policy.
     */
    equipmentSharingPolicyId: ID;
    /**
     * The employees who are sharing the equipment.
     */
    employees?: IEmployee[];
    /**
     * The organization teams who are sharing the equipment.
     */
    teams?: IOrganizationTeam[];
}
