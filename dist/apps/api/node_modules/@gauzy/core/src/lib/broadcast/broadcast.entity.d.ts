import { EntityRepositoryType } from '@mikro-orm/core';
import { BroadcastCategoryEnum, BroadcastVisibilityModeEnum, IAudienceRules, IBroadcast, ID, IEmployee, JsonData } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmBroadcastRepository } from './repository/mikro-orm-broadcast.repository';
export declare class Broadcast extends BasePerEntityType implements IBroadcast {
    [EntityRepositoryType]?: MikroOrmBroadcastRepository;
    /**
     * The title/summary of the broadcast
     */
    title: string;
    /**
     * The rich content body of the broadcast (JSON or text)
     */
    content: JsonData;
    /**
     * The category/type of broadcast
     */
    category: BroadcastCategoryEnum;
    /**
     * The visibility mode defining who can see the broadcast
     */
    visibilityMode: BroadcastVisibilityModeEnum;
    /**
     * The audience rules for restricted visibility (JSON)
     */
    audienceRules?: IAudienceRules | string;
    /**
     * The date when the broadcast was published
     */
    publishedAt?: Date;
    /**
     * Broadcast author/publisher
     */
    employee?: IEmployee;
    /**
     * Broadcast author/publisher ID
     */
    employeeId?: ID;
}
