import { BaseEntityEnum, NotificationActionTypeEnum } from '@gauzy/contracts';
/**
 * Generates a notification title by replacing placeholders in a predefined template.
 *
 * This function retrieves a template corresponding to the provided notification action
 * from the `EmployeeNotificationTemplates` object. It then replaces any placeholder in the template,
 * formatted as `{placeholder}`, with the actual values provided via the function parameters.
 *
 * The supported placeholders are:
 * - `{action}`: Will be replaced with the `action` parameter, indicating the notification type.
 * - `{entity}`: Will be replaced with the `entity` parameter, indicating the type of entity associated with the notification.
 * - `{entityName}`: Will be replaced with the `entityName` parameter, providing context about the specific entity.
 * - `{employeeName}`: Will be replaced with the `employeeName` parameter, specifying the employee related to the notification.
 *
 * @param {NotificationActionTypeEnum} action - The type of notification action triggering the title (e.g., 'Paid', 'Assigned').
 * @param {BaseEntityEnum} entity - The entity type associated with the notification (e.g., 'Task', 'Employee').
 * @param {string} entityName - The human-readable name of the entity, providing context in the title.
 * @param {string} employeeName - The name of the employee involved in the action, to personalize the notification.
 * @returns {string} The generated notification title with all placeholders replaced by their corresponding values.
 */
export declare function generateNotificationTitle(action: NotificationActionTypeEnum, entity: BaseEntityEnum, entityName: string, employeeName: string): string;
