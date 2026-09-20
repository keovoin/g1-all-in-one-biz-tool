"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecentVisitSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const employee_recent_visit_entity_1 = require("./employee-recent-visit.entity");
let EmployeeRecentVisitSubscriber = class EmployeeRecentVisitSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to EmployeeRecentVisit events.
     */
    listenTo() {
        return employee_recent_visit_entity_1.EmployeeRecentVisit;
    }
    /**
     * Serializes the data property to a JSON string for SQLite databases.
     *
     * @param entity The EmployeeRecentVisit entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    async serializeDataForSQLite(entity) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // serialize the `data` field if it's an object
                if (typeof entity.data === 'object') {
                    entity.data = JSON.stringify(entity.data);
                }
            }
        }
        catch (error) {
            // Log the error and reset the data to an empty object if JSON parsing fails
            console.error('Error stringify data:', error);
            entity.data = '{}';
        }
    }
    /**
     * Called before an EmployeeRecentVisit entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the data property to a JSON string
     * for SQLite databases.
     *
     * @param entity The EmployeeRecentVisit entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        await this.serializeDataForSQLite(entity);
    }
    /**
     * Called before an EmployeeRecentVisit entity is updated in the database.
     * This method prepares the entity for update, particularly by serializing the data property to a JSON string
     * for SQLite databases.
     *
     * @param entity The EmployeeRecentVisit entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    async beforeEntityUpdate(entity, em) {
        await this.serializeDataForSQLite(entity);
    }
    /**
     * Handles the parsing of JSON data after the EmployeeRecentVisit entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `data` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param entity The EmployeeRecentVisit entity that has been loaded from the database.
     * @param em The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    async afterEntityLoad(entity, em) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // Parse the `data` field if it's a string
                if (entity.data && typeof entity.data === 'string') {
                    entity.data = JSON.parse(entity.data);
                }
            }
        }
        catch (error) {
            // Log the error and reset the data to an empty object if JSON parsing fails
            console.error('Error parsing JSON data:', error);
            entity.data = {};
        }
    }
};
exports.EmployeeRecentVisitSubscriber = EmployeeRecentVisitSubscriber;
exports.EmployeeRecentVisitSubscriber = EmployeeRecentVisitSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], EmployeeRecentVisitSubscriber);
//# sourceMappingURL=employee-recent-visit.subscriber.js.map