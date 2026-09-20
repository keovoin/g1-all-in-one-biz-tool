import { ActorTypeEnum, IBasePerEntityType, ID } from './base-entity.model';
import { IEmployee, IEmployeeEntityInput as ICommentAuthor } from './employee.model';
import { IOrganizationTeam } from './organization-team.model';
import { IMentionEmployeeIds } from './mention.model';
export interface IComment extends IBasePerEntityType, ICommentAuthor {
    comment: string;
    actorType?: ActorTypeEnum;
    resolved?: boolean;
    resolvedAt?: Date;
    editedAt?: Date;
    members?: IEmployee[];
    teams?: IOrganizationTeam[];
    parent?: IComment;
    parentId?: ID;
    replies?: IComment[];
    resolvedByEmployee?: IEmployee;
    resolvedByEmployeeId?: ID;
}
export interface ICommentCreateInput extends IBasePerEntityType, ICommentAuthor, IMentionEmployeeIds {
    comment: string;
    entityName?: string;
    parent?: IComment;
    parentId?: ID;
    members?: IEmployee[];
    teams?: IOrganizationTeam[];
}
export interface ICommentUpdateInput extends IMentionEmployeeIds, Partial<Omit<IComment, 'entity' | 'entityId' | 'employeeId' | 'employee'>> {
}
export interface ICommentFindInput extends Pick<IComment, 'entity' | 'entityId'> {
}
