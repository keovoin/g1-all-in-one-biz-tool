import { ActorTypeEnum, IBasePerTenantAndOrganizationEntityModel, ID, OmitFields } from './base-entity.model';
import { IEmployeeEntityInput } from './employee.model';
/**
 * Reaction entity interface
 */
export interface IReaction extends IBasePerTenantAndOrganizationEntityModel, IEmployeeEntityInput {
    entity: ReactionEntityEnum;
    entityId: ID;
    emoji: string;
    actorType?: ActorTypeEnum;
}
/**
 * Reaction entity enum
 */
export declare enum ReactionEntityEnum {
    Broadcast = "Broadcast",
    Comment = "Comment",
    Document = "Document",
    Task = "Task"
}
/**
 * Reaction create input interface
 */
export interface IReactionCreateInput extends OmitFields<IReaction, 'employee' | 'employeeId'> {
}
/**
 * Reaction update input interface
 */
export interface IReactionUpdateInput extends IBasePerTenantAndOrganizationEntityModel, Pick<IReaction, 'emoji'> {
}
