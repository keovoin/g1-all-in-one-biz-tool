import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { IEmployeeNotification, IEmployeeNotificationCreateInput, NotificationActionTypeEnum, IMarkAllAsReadResponse } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../core/crud/tenant-aware-crud.service';
import { EmployeeNotificationSettingService } from '../employee-notification-setting/employee-notification-setting.service';
import { EmployeeNotification } from './employee-notification.entity';
import { TypeOrmEmployeeNotificationRepository } from './repository/type-orm-employee-notification.repository';
import { MikroOrmEmployeeNotificationRepository } from './repository/mikro-orm-employee-notification.repository';
/**
 * How long an unread notification absorbs an identical one (see `findRedeliveredNotification`).
 *
 * It exists to absorb a redelivered or duplicated `EmployeeCreateNotificationEvent` — the same event
 * handled again moments later — not to merge distinct events about the same entity, so keep it short.
 */
export declare const EMPLOYEE_NOTIFICATION_REDELIVERY_WINDOW_MS: number;
export declare class EmployeeNotificationService extends TenantAwareCrudService<EmployeeNotification> {
    readonly typeOrmEmployeeNotificationRepository: TypeOrmEmployeeNotificationRepository;
    readonly mikroOrmEmployeeNotificationRepository: MikroOrmEmployeeNotificationRepository;
    private readonly _employeeNotificationSettingService;
    private readonly _eventBus;
    readonly logger: Logger;
    constructor(typeOrmEmployeeNotificationRepository: TypeOrmEmployeeNotificationRepository, mikroOrmEmployeeNotificationRepository: MikroOrmEmployeeNotificationRepository, _employeeNotificationSettingService: EmployeeNotificationSettingService, _eventBus: EventBus);
    /**
     * Creates a new notification entry with the provided input, while associating it with the current tenant.
     *
     * @param input - The data required to create an notification entry.
     * @param options.absorbRedelivery - Return an existing identical notification instead of inserting a duplicate
     * (see `findRedeliveredNotification`). Opt-in for a future at-least-once event transport: no caller sets it
     * today, so the event handler and `POST /employee-notification` insert one row per call, exactly as before.
     * @returns The created notification entry.
     * @throws BadRequestException when the log creation fails.
     */
    create(input: IEmployeeNotificationCreateInput, { absorbRedelivery }?: {
        absorbRedelivery?: boolean;
    }): Promise<IEmployeeNotification | undefined>;
    /**
     * Marks all unread and un-archived notifications for the current employee as read.
     *
     * @throws {BadRequestException} If an error occurs while updating notifications.
     * @returns {Promise<{ success: boolean; count: number }>} A promise that resolves to an object indicating the success status and the count of notifications updated.
     */
    markAllAsRead(): Promise<IMarkAllAsReadResponse>;
    /**
     * Publishes a employee notification event to create a new notification.
     *
     * @param input - The input data required to create the notification.
     * @param actionType - The type of action that triggered the notification.
     * @param entityName - The name of the entity related to the notification.
     * @param employeeName - The name of the employee related to the notification.
     */
    publishNotificationEvent(input: IEmployeeNotificationCreateInput, actionType: NotificationActionTypeEnum, entityName: string, employeeName: string): void;
    /**
     * Finds the notification that `input` is a redelivery of, if there is one.
     *
     * A redelivered event is identical to the original, so a match requires the same receiver, source
     * entity, type, sender, title and message in the same tenant and organization, on a row that is still
     * unread, not archived and created within {@link EMPLOYEE_NOTIFICATION_REDELIVERY_WINDOW_MS}. Once the
     * receiver has read or archived it, or the window has passed, the same event is a new notification
     * (e.g. an employee unassigned and later re-assigned to the same task must be told again).
     *
     * Returns `null` ("insert as usual") whenever a duplicate cannot be proven:
     * - a key is missing. TypeORM drops `undefined` where-keys rather than matching NULL, so a missing
     *   key would WIDEN the lookup: `MentionService` publishes without `receiverEmployeeId`, and an
     *   unguarded lookup turned every mention on a task after the first into a no-op;
     * - the lookup itself fails. Deduplication is best effort and must never cost a notification.
     *
     * This is not a concurrency guard: two deliveries racing each other can both miss and both insert.
     * It covers sequential redelivery only.
     *
     * @param input - The notification about to be created.
     * @param tenantId - The tenant the notification is created in.
     * @param organizationId - The organization the notification is created in.
     * @returns The existing notification, or `null` when a new row must be inserted.
     */
    private findRedeliveredNotification;
    /**
     * Determines whether a employee notification should be created based on the employee's notification settings and the notification type.
     *
     * @param employeeNotificationSetting - The employee's notification settings.
     * @param type - The type of notification.
     * @returns {boolean} True if a employee notification should be created, false otherwise.
     */
    private shouldCreateEmployeeNotification;
}
