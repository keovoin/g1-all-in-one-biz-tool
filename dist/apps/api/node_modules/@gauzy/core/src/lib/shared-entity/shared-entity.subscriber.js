"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedEntitySubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const shared_entity_entity_1 = require("./shared-entity.entity");
let SharedEntitySubscriber = class SharedEntitySubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to SharedEntity events.
     */
    listenTo() {
        return shared_entity_entity_1.SharedEntity;
    }
    /**
     * Serializes the shareRules and sharedOptions properties to a JSON string for SQLite databases.
     *
     * @param entity The SharedEntity entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    async serializeShareRulesAndSharedOptionsForSQLite(entity) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // serialize the `shareRules` field if it's an object
                if (typeof entity.shareRules === 'object') {
                    entity.shareRules = JSON.stringify(entity.shareRules);
                }
                // serialize the `sharedOptions` field if it's an object
                if (typeof entity.sharedOptions === 'object') {
                    entity.sharedOptions = JSON.stringify(entity.sharedOptions);
                }
            }
        }
        catch (error) {
            // Log the error and reset the sharedOptions to an empty object if JSON parsing fails
            console.error('Error stringify sharedOptions:', error);
            entity.shareRules = JSON.stringify({ fields: [] });
            entity.sharedOptions = '{}';
        }
    }
    /**
     * Called before a SharedEntity entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the shareRules and sharedOptions properties to a JSON string
     * for SQLite databases.
     *
     * @param entity The SharedEntity entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        await this.serializeShareRulesAndSharedOptionsForSQLite(entity);
    }
    /**
     * Called before a SharedEntity entity is updated in the database.
     * This method prepares the entity for update, particularly by serializing the shareRules and sharedOptions properties to a JSON string
     * for SQLite databases.
     *
     * @param entity The SharedEntity entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    async beforeEntityUpdate(entity, em) {
        await this.serializeShareRulesAndSharedOptionsForSQLite(entity);
    }
    /**
     * Handles the parsing of JSON data after the SharedEntity entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `shareRules` and `sharedOptions` fields, stored as a JSON string,
     * are parsed back into a JavaScript object.
     *
     * @param entity The SharedEntity entity that has been loaded from the database.
     * @param em The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    async afterEntityLoad(entity, em) {
        try {
            // Check if the database is SQLite
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                // Parse the `shareRules` field if it's a string
                if (entity.shareRules && typeof entity.shareRules === 'string') {
                    entity.shareRules = JSON.parse(entity.shareRules);
                }
                // Parse the `sharedOptions` field if it's a string
                if (entity.sharedOptions && typeof entity.sharedOptions === 'string') {
                    entity.sharedOptions = JSON.parse(entity.sharedOptions);
                }
            }
        }
        catch (error) {
            // Log the error and reset the shareRules and sharedOptions to an empty object if JSON parsing fails
            console.error('Error parsing JSON data:', error);
            entity.shareRules = { fields: [], relations: {} };
            entity.sharedOptions = {};
        }
    }
};
exports.SharedEntitySubscriber = SharedEntitySubscriber;
exports.SharedEntitySubscriber = SharedEntitySubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], SharedEntitySubscriber);
//# sourceMappingURL=shared-entity.subscriber.js.map