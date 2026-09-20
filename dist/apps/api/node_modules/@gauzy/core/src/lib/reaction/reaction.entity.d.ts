import { EntityRepositoryType } from '@mikro-orm/core';
import { ActorTypeEnum, ID, IEmployee, IReaction, ReactionEntityEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmReactionRepository } from './repository/mikro-orm-reaction.repository';
export declare class Reaction extends TenantOrganizationBaseEntity implements IReaction {
    [EntityRepositoryType]?: MikroOrmReactionRepository;
    entity: ReactionEntityEnum;
    entityId: ID;
    emoji: string;
    actorType?: ActorTypeEnum;
    /**
     * Reaction author
     */
    employee?: IEmployee;
    /**
     * Reaction author ID
     */
    employeeId?: ID;
}
