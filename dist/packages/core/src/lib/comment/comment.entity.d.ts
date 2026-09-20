import { EntityRepositoryType } from '@mikro-orm/core';
import { ActorTypeEnum, IComment, ID, IEmployee, IOrganizationTeam } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmCommentRepository } from './repository/mikro-orm-comment.repository';
export declare class Comment extends BasePerEntityType implements IComment {
    [EntityRepositoryType]?: MikroOrmCommentRepository;
    comment: string;
    actorType?: ActorTypeEnum;
    resolved?: boolean;
    resolvedAt?: Date;
    editedAt?: Date;
    /**
     * Comment author
     */
    employee?: IEmployee;
    /**
     * Comment author ID
     */
    employeeId?: ID;
    /**
     * Resolved by
     */
    resolvedByEmployee?: IEmployee;
    /**
     * Resolved by ID
     */
    resolvedByEmployeeId?: ID;
    /**
     * Comment parent-child relationship
     */
    parent?: IComment;
    /**
     * Parent ID of comment
     */
    parentId?: ID;
    /**
     * Replies comments
     */
    replies?: IComment[];
    /**
     * Comment members
     */
    members?: IEmployee[];
    /**
     * Comment teams
     */
    teams?: IOrganizationTeam[];
}
