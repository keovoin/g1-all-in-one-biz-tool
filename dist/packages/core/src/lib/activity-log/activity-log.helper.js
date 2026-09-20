"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActivityLogDescription = generateActivityLogDescription;
exports.activityLogUpdatedFieldsAndValues = activityLogUpdatedFieldsAndValues;
exports.serializeActivityLogForSqlite = serializeActivityLogForSqlite;
const contracts_1 = require("@gauzy/contracts");
const ActivityTemplates = {
    [contracts_1.ActionTypeEnum.Created]: `{action} a new {entity} called "{entityName}"`,
    [contracts_1.ActionTypeEnum.Updated]: `{action} {entity} "{entityName}"`,
    [contracts_1.ActionTypeEnum.Deleted]: `{action} {entity} "{entityName}"`
};
/**
 * Generates an activity description based on the action type, entity, and entity name.
 * @param action - The action performed (e.g., CREATED, UPDATED, DELETED).
 * @param entity - The type of entity involved in the action (e.g., Project, User).
 * @param entityName - The name of the specific entity instance.
 * @returns A formatted description string.
 */
function generateActivityLogDescription(action, entity, entityName) {
    // Get the template corresponding to the action
    const template = ActivityTemplates[action] || '{action} {entity} "{entityName}"';
    // Replace placeholders in the template with actual values
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        switch (key) {
            case 'action':
                return action;
            case 'entity':
                return entity;
            case 'entityName':
                return entityName;
            default:
                return '';
        }
    });
}
/**
 * @description Log updated field names, old and new values for Activity Log Updated Actions
 * @template T
 * @param {T} originalValues - Old values before update
 * @param {Partial<T>} updated - Updated values
 * @returns An object with updated fields, their old and new values
 */
function activityLogUpdatedFieldsAndValues(originalValues, updated) {
    const updatedFields = [];
    const previousValues = [];
    const updatedValues = [];
    for (const key of Object.keys(updated)) {
        if (originalValues[key] !== updated[key]) {
            // Add updated field
            updatedFields.push(key);
            // Add old and new values
            previousValues.push({ [key]: originalValues[key] });
            updatedValues.push({ [key]: updated[key] });
        }
    }
    return { updatedFields, previousValues, updatedValues };
}
/**
 * Serializes JSON fields to strings for SQLite databases.
 * This prevents the "Too many parameter values" error by reducing bind parameters.
 *
 * @param input - The activity log input with potential JSON fields
 * @returns The input with JSON fields serialized to strings
 */
function serializeActivityLogForSqlite(input) {
    const jsonFields = [
        'data',
        'updatedFields',
        'previousValues',
        'updatedValues',
        'previousEntities',
        'updatedEntities'
    ];
    const serialized = { ...input };
    for (const field of jsonFields) {
        if (serialized[field] !== undefined && serialized[field] !== null) {
            if (typeof serialized[field] === 'object') {
                serialized[field] = JSON.stringify(serialized[field]);
            }
        }
    }
    return serialized;
}
//# sourceMappingURL=activity-log.helper.js.map