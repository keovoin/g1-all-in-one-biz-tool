"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLinkSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const resource_link_entity_1 = require("./resource-link.entity");
let ResourceLinkSubscriber = class ResourceLinkSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to ResourceLink events.
     */
    listenTo() {
        return resource_link_entity_1.ResourceLink;
    }
    /**
     * Called before an ResourceLink entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the metaData property to a JSON string
     * for SQLite databases.
     *
     * @param entity The ResourceLink entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Check if the database is SQLite and the entity's metaData is a JavaScript object
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                entity.metaData = JSON.stringify(entity.metaData);
            }
        }
        catch (error) {
            // In case of error during JSON serialization, reset metaData to an empty object
            entity.metaData = JSON.stringify({});
        }
    }
    /**
     * Handles the parsing of JSON data after the ResourceLink entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `metaData` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {ResourceLink} entity - The ResourceLink entity that has been loaded from the database.
     * @param {MultiOrmEntityManager} [em] - The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    async afterEntityLoad(entity, em) {
        try {
            // Check if the database is SQLite and if `metaData` is a non-null string
            if (((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) && entity.metaData && typeof entity.metaData === 'string') {
                entity.metaData = JSON.parse(entity.metaData);
            }
        }
        catch (error) {
            // Log the error and reset the data to an empty object if JSON parsing fails
            console.error('Error parsing JSON data in afterEntityLoad:', error);
            entity.metaData = {};
        }
    }
};
exports.ResourceLinkSubscriber = ResourceLinkSubscriber;
exports.ResourceLinkSubscriber = ResourceLinkSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], ResourceLinkSubscriber);
//# sourceMappingURL=resource-link.subscriber.js.map