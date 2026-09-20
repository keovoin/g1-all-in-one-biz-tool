import { EntityRepositoryType } from '@mikro-orm/core';
import { ActorTypeEnum, ID, IEmployee, IEntitySubscription, EntitySubscriptionTypeEnum } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmEntitySubscriptionRepository } from './repository/mikro-orm-entity-subscription.repository';
export declare class EntitySubscription extends BasePerEntityType implements IEntitySubscription {
    [EntityRepositoryType]?: MikroOrmEntitySubscriptionRepository;
    actorType?: ActorTypeEnum;
    /**
     * The type of subscription.
     */
    type: EntitySubscriptionTypeEnum;
    /**
     * The employee who subscribed to the entity.
     */
    employee?: IEmployee;
    /**
     * The employee id who subscribed to the entity.
     */
    employeeId?: ID;
}
