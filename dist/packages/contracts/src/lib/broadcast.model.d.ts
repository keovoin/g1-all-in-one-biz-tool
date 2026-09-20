import { IBasePerEntityType, ID, JsonData, OmitFields } from './base-entity.model';
import { IEmployeeEntityInput as IBroadcastAuthor } from './employee.model';
import { RolesEnum } from './role.model';
/**
 * Broadcast category enum
 * Defines the type of broadcast content
 */
export declare enum BroadcastCategoryEnum {
    STATUS_REPORT = "STATUS_REPORT",// Regular status update
    MILESTONE = "MILESTONE",// Achievement or milestone reached
    ANNOUNCEMENT = "ANNOUNCEMENT",// General announcement
    ALERT = "ALERT",// Urgent or important alert
    DECISION = "DECISION",// Decision communication
    CHANGELOG = "CHANGELOG"
}
/**
 * Broadcast visibility mode enum
 * Defines who can see the broadcast
 */
export declare enum BroadcastVisibilityModeEnum {
    ENTITY_MEMBERS = "ENTITY_MEMBERS",// Only entity members (e.g., project members)
    ORGANIZATION = "ORGANIZATION",// All organization members
    RESTRICTED = "RESTRICTED",// Explicit roles or users defined in audienceRules
    EXTERNAL_VIEW = "EXTERNAL_VIEW"
}
/**
 * Audience rules interface
 * Defines fine-grained access constraints for restricted broadcasts
 */
export interface IAudienceRules {
    roles?: RolesEnum[];
    userIds?: ID[];
    employeeIds?: ID[];
    teamIds?: ID[];
    excludeRoles?: RolesEnum[];
}
/**
 * Broadcast entity interface
 * A structured communication entry published within the context of an entity
 */
export interface IBroadcast extends IBasePerEntityType, IBroadcastAuthor {
    title: string;
    content: JsonData;
    category: BroadcastCategoryEnum;
    visibilityMode: BroadcastVisibilityModeEnum;
    audienceRules?: IAudienceRules | string;
    publishedAt?: Date;
}
/**
 * Broadcast create input interface
 */
export interface IBroadcastCreateInput extends OmitFields<IBroadcast, 'publishedAt' | 'employeeId' | 'employee'> {
    publishedAt?: Date;
}
/**
 * Broadcast update input interface
 * Cannot update entity, entityId, publisher after creation
 */
export interface IBroadcastUpdateInput extends Partial<OmitFields<IBroadcast, 'entity' | 'entityId' | 'employeeId' | 'employee'>> {
}
/**
 * Broadcast find input interface
 * Used for filtering broadcasts
 */
export interface IBroadcastFindInput extends Partial<Pick<IBroadcast, 'entity' | 'entityId' | 'category' | 'visibilityMode' | 'isArchived'>> {
    publisherId?: ID;
}
