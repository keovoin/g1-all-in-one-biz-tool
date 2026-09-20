"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const dashboard_entity_1 = require("./dashboard.entity");
let DashboardSubscriber = class DashboardSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Dashboard events.
     */
    listenTo() {
        return dashboard_entity_1.Dashboard;
    }
    /**
     * Called before an Dashboard entity is inserted or updated in the database.
     * This method prepares the entity for insertion or update by serializing the contentHtml property to a JSON string
     * for SQLite databases.
     *
     * @param entity The Dashboard entity that is about to be created or updated.
     * @returns {Promise<void>} A promise that resolves when the pre-creation or pre-update processing is complete.
     */
    async serializeContentForSQLite(entity) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // serialize the `contentHtml` field if it's an object
                if (typeof entity.contentHtml === 'object') {
                    entity.contentHtml = JSON.stringify(entity.contentHtml);
                }
            }
        }
        catch (error) {
            entity.contentHtml = '{}';
        }
    }
    /**
     * Called before an Dashboard entity is inserted or created in the database.
     * This method prepares the entity for insertion by serializing the contentHtml property to a JSON string for SQLite DBs
     *
     * @param entity The Dashboard entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    async beforeEntityCreate(entity) {
        await this.serializeContentForSQLite(entity);
    }
    /**
     * Called before an Dashboard entity is updated in the database.
     * This method prepares the entity for update by serializing the contentHtml property to a JSON string
     *
     * @param entity The Dashboard entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    async beforeEntityUpdate(entity) {
        await this.serializeContentForSQLite(entity);
    }
    /**
     * Handles the parsing of JSON data after the Dashboard entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `contentHtml` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {Dashboard} entity - The Dashboard entity that has been loaded from the database.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // Parse the `contentHtml` field if it's a string
                if (entity.contentHtml && typeof entity.contentHtml === 'string') {
                    entity.contentHtml = JSON.parse(entity.contentHtml);
                }
            }
        }
        catch (error) {
            entity.contentHtml = {};
        }
    }
};
exports.DashboardSubscriber = DashboardSubscriber;
exports.DashboardSubscriber = DashboardSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], DashboardSubscriber);
//# sourceMappingURL=dashboard.subscriber.js.map