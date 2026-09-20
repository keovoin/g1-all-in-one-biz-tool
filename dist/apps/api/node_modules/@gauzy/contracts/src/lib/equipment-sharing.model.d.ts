import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IEmployee } from './employee.model';
import { IOrganizationTeam } from './organization-team.model';
import { IEquipment } from './equipment.model';
import { IEquipmentSharingPolicy } from './equipment-sharing-policy.model';
interface IEquipmentSharingAssociations {
    employees?: IEmployee[];
    teams?: IOrganizationTeam[];
}
interface IBaseEquipmentSharing extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
    shareRequestDay: Date;
    shareStartDay: Date;
    shareEndDay: Date;
    status: number;
}
export interface IEquipmentSharing extends IBaseEquipmentSharing, IEquipmentSharingAssociations {
    equipment: IEquipment;
    equipmentId: ID;
    equipmentSharingPolicy: IEquipmentSharingPolicy;
    equipmentSharingPolicyId: ID;
}
export interface IEquipmentSharingCreateInput extends IBaseEquipmentSharing {
    equipment?: IEquipment;
    equipmentId?: ID;
    equipmentSharingPolicy?: IEquipmentSharingPolicy;
    equipmentSharingPolicyId?: ID;
}
export interface IEquipmentSharingUpdateInput extends Partial<IEquipmentSharingCreateInput> {
}
export declare enum EquipmentSharingStatusEnum {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    REFUSED = "REFUSED"
}
export interface ISelectedEquipmentSharing {
    data: IEquipmentSharing;
    isSelected: boolean;
}
export declare enum EquipmentSharingParticipantEnum {
    EMPLOYEE = "EMPLOYEE",
    TEAM = "TEAM"
}
export {};
