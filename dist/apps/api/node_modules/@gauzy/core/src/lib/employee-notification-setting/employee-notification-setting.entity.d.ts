import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IEmployeeNotificationSetting, JsonData, IEmployee } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmEmployeeNotificationSettingRepository } from './repository/mikro-orm-employee-notification-setting.repository';
export declare class EmployeeNotificationSetting extends TenantOrganizationBaseEntity implements IEmployeeNotificationSetting {
    [EntityRepositoryType]?: MikroOrmEmployeeNotificationSettingRepository;
    /**
     * Indicates whether payment-related notifications are enabled for the employee.
     *
     * When set to true, the employee will receive notifications regarding payment events.
     * Defaults to true if not explicitly modified.
     */
    payment?: boolean;
    /**
     * Indicates whether assignment-related notifications are enabled for the employee.
     *
     * When enabled, the employee will receive notifications related to new or updated assignments.
     * Defaults to true if no specific value is provided.
     */
    assignment?: boolean;
    /**
     * Indicates whether invitation-related notifications are enabled for the employee.
     *
     * If true, the employee will be notified of any invitations sent to them.
     * The default value is true to ensure invitations are not missed.
     */
    invitation?: boolean;
    /**
     * Indicates whether mention-related notifications are enabled for the employee.
     *
     * This property controls whether the employee receives notifications when they are mentioned
     * in comments, posts, or other communications. Defaults to true.
     */
    mention?: boolean;
    /**
     * Indicates whether comment-related notifications are enabled for the employee.
     *
     * When set to true, the employee will receive notifications when new comments are made
     * in areas relevant to them. Defaults to true if not explicitly specified.
     */
    comment?: boolean;
    /**
     * Indicates whether message-related notifications are enabled for the employee.
     *
     * If true, the employee will receive notifications for direct messages or similar
     * communications. The default value is true to ensure timely alerts.
     */
    message?: boolean;
    /**
     * Stores additional, custom notification preferences in a JSON format.
     *
     * This field allows for flexible storage of any extra preferences not covered by the
     * standard boolean properties above. The underlying database column type adapts based on the
     * database in use:
     * - PostgreSQL: Uses 'jsonb'
     * - MySQL: Uses 'json'
     * - Other databases: Defaults to 'text'
     *
     * This field is required and must not be empty.
     */
    preferences?: JsonData;
    /**
     * The associated employee entity.
     *
     * This one-to-one relation (owning side) links to an Employee.
     * Cascade insert/update is enabled and deletion cascades to this relation.
     */
    employee?: IEmployee;
    /**
     * The UUID of the associated employee.
     *
     * This column stores the relation ID for the linked Employee entity.
     * It is automatically derived from the employee relation.
     */
    employeeId?: ID;
}
