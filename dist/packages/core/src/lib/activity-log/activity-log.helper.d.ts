import { ActionTypeEnum, BaseEntityEnum, IActivityLogUpdatedValues } from '@gauzy/contracts';
/**
 * Generates an activity description based on the action type, entity, and entity name.
 * @param action - The action performed (e.g., CREATED, UPDATED, DELETED).
 * @param entity - The type of entity involved in the action (e.g., Project, User).
 * @param entityName - The name of the specific entity instance.
 * @returns A formatted description string.
 */
export declare function generateActivityLogDescription(action: ActionTypeEnum, entity: BaseEntityEnum, entityName: string): string;
/**
 * @description Log updated field names, old and new values for Activity Log Updated Actions
 * @template T
 * @param {T} originalValues - Old values before update
 * @param {Partial<T>} updated - Updated values
 * @returns An object with updated fields, their old and new values
 */
export declare function activityLogUpdatedFieldsAndValues<T>(originalValues: T, updated: Partial<T>): {
    updatedFields: string[];
    previousValues: IActivityLogUpdatedValues[];
    updatedValues: IActivityLogUpdatedValues[];
};
/**
 * Serializes JSON fields to strings for SQLite databases.
 * This prevents the "Too many parameter values" error by reducing bind parameters.
 *
 * @param input - The activity log input with potential JSON fields
 * @returns The input with JSON fields serialized to strings
 */
export declare function serializeActivityLogForSqlite<T extends Record<string, any>>(input: T): Record<string, any>;
