import { ActorTypeEnum, BaseEntityEnum, IBasePerEntityType, ID, OmitFields } from './base-entity.model';
import { IEmployee, IEmployeeEntityInput as IMentionAuthor } from './employee.model';
export interface IMention extends IBasePerEntityType, IMentionAuthor {
    actorType?: ActorTypeEnum;
    parentEntityId?: ID;
    parentEntityType?: BaseEntityEnum;
    mentionedEmployee?: IEmployee;
    mentionedEmployeeId?: ID;
}
export interface IMentionCreateInput extends OmitFields<IMention> {
    entityName?: string;
}
export interface IMentionEmployeeIds {
    mentionEmployeeIds?: ID[];
}
