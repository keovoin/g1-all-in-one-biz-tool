import { EntityRepositoryType } from '@mikro-orm/core';
import { ActorTypeEnum, BaseEntityEnum, ID, IEmployee, IMention } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmMentionRepository } from './repository/mikro-orm-mention.repository';
export declare class Mention extends BasePerEntityType implements IMention {
    [EntityRepositoryType]?: MikroOrmMentionRepository;
    actorType?: ActorTypeEnum;
    /**
     * The parent entity ID
     *
     * E.g : If the user was mentioned is in a comment, we need this for subscription and notifications purpose (It could be the `task ID` concerned by comment, then the user will be subscribed to that task instead of to a comment itself because in this case, `entityId` will store the comment ID)
     */
    parentEntityId?: ID;
    /**
     * The type of the parent entity (optional)
     */
    parentEntityType?: BaseEntityEnum;
    /**
     * The employee whom to be mentioned
     */
    mentionedEmployee?: IEmployee;
    /**
     * The ID of the employee who is mentioned
     */
    mentionedEmployeeId?: ID;
    /**
     * The employee who mentioned the other employee
     */
    employee?: IEmployee;
    /**
     * The ID of the employee who mentioned another employee
     */
    employeeId?: ID;
}
