import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IEmployeeNotification, EmployeeNotificationTypeEnum, IEmployee } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmEmployeeNotificationRepository } from './repository/mikro-orm-employee-notification.repository';
export declare class EmployeeNotification extends BasePerEntityType implements IEmployeeNotification {
    [EntityRepositoryType]?: MikroOrmEmployeeNotificationRepository;
    /**
     * The notification title
     */
    title?: string;
    /**
     * The notification message
     */
    message?: string;
    /**
     * The notification type
     */
    type?: EmployeeNotificationTypeEnum;
    /**
     * Indicates if the notification is read
     */
    isRead?: boolean;
    /**
     * The date the notification was read
     */
    readAt?: Date;
    /**
     * The date till the notification is supposed to be in snooze status
     */
    onHoldUntil?: Date;
    /**
     * The employee who sent the notification.
     *
     * This property establishes a many-to-one relationship to the Employee entity
     * representing the sender of the notification. The relation is optional and
     * is configured to cascade delete the notification if the employee is removed.
     */
    sentByEmployee?: IEmployee;
    /**
     * The ID of the employee who sent the notification.
     *
     * This column stores the UUID of the employee linked to the `sentByEmployee` relation.
     * It is optional, indexed for performance, and automatically populated via the relation.
     */
    sentByEmployeeId?: ID;
    /**
     * The employee who is set to receive the notification.
     *
     * This property establishes a many-to-one relationship to the Employee entity
     * representing the receiver of the notification. The relation is optional and
     * is configured to cascade delete the notification if the employee is removed.
     */
    receiverEmployee?: IEmployee;
    /**
     * The ID of the employee who is set to receive the notification.
     *
     * This column stores the UUID of the employee linked to the `receiverEmployee` relation.
     * It is optional, indexed for performance, and automatically populated via the relation.
     */
    receiverEmployeeId?: ID;
}
