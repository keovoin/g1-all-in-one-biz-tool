"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardWidgetSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const dashboard_widget_entity_1 = require("./dashboard-widget.entity");
let DashboardWidgetSubscriber = class DashboardWidgetSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listens to DashboardWidget events.
     */
    listenTo() {
        return dashboard_widget_entity_1.DashboardWidget;
    }
    /**
     * Called before a DashboardWidget entity is inserted or updated in the database.
     * This method prepares the entity for insertion or update by serializing the options property to a JSON string
     * for SQLite databases.
     *
     * @param entity The DashboardWidget entity that is about to be created or updated.
     * @returns {Promise<void>} A promise that resolves when the pre-creation or pre-update processing is complete.
     */
    async serializeOptionsForSQLite(entity) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // serialize the `options` field if it's an object
                if (typeof entity.options === 'object') {
                    entity.options = JSON.stringify(entity.options);
                }
            }
        }
        catch (error) {
            // Log the error and reset the data to an empty object if JSON parsing fails
            console.error(error);
            entity.options = '{}';
        }
    }
    /**
     * Called before a DashboardWidget entity is inserted or created in the database.
     * This method prepares the entity for insertion by serializing the options property to a JSON string for SQLite DBs
     *
     * @param entity The DashboardWidget entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    async beforeEntityCreate(entity) {
        await this.serializeOptionsForSQLite(entity);
    }
    /**
     * Called before a DashboardWidget entity is updated in the database.
     * This method prepares the entity for update by serializing the options property to a JSON string
     *
     * @param entity The DashboardWidget entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    async beforeEntityUpdate(entity) {
        await this.serializeOptionsForSQLite(entity);
    }
    /**
     * Handles the parsing of JSON data after the DashboardWidget entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `options` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {DashboardWidget} entity - The DashboardWidget entity that has been loaded from the database.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // Parse the `options` field if it's a string
                if (typeof entity.options === 'string') {
                    entity.options = JSON.parse(entity.options);
                }
            }
        }
        catch (error) {
            // Log the error and reset the options to an empty object if JSON parsing fails
            console.error('Error parsing options JSON:', error);
            entity.options = {};
        }
    }
};
exports.DashboardWidgetSubscriber = DashboardWidgetSubscriber;
exports.DashboardWidgetSubscriber = DashboardWidgetSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], DashboardWidgetSubscriber);
//# sourceMappingURL=dashboard-widget.subscriber.js.map