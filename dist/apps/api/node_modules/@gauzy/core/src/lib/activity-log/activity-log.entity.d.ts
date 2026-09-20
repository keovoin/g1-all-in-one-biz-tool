import { EntityRepositoryType } from '@mikro-orm/core';
import { ActionTypeEnum, ActorTypeEnum, IActivityLog, ID, JsonData, IEmployee } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmActivityLogRepository } from './repository/mikro-orm-activity-log.repository';
export declare class ActivityLog extends BasePerEntityType implements IActivityLog {
    [EntityRepositoryType]?: MikroOrmActivityLogRepository;
    action: ActionTypeEnum;
    actorType?: ActorTypeEnum;
    description?: string;
    updatedFields?: string[];
    previousValues?: Record<string, any>[];
    updatedValues?: Record<string, any>[];
    previousEntities?: Record<string, any>[];
    updatedEntities?: Record<string, any>[];
    data?: JsonData;
    /**
     * Activity Log Author
     */
    employee?: IEmployee;
    /**
     * Activity Log Author ID
     */
    employeeId?: ID;
}
