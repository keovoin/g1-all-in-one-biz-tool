"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const organization_strategic_initiative_entity_1 = require("./organization-strategic-initiative.entity");
let OrganizationStrategicInitiativeSubscriber = class OrganizationStrategicInitiativeSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listens to OrganizationStrategicInitiative events.
     */
    listenTo() {
        return organization_strategic_initiative_entity_1.OrganizationStrategicInitiative;
    }
    /**
     * Serializes the signals property to a JSON string for SQLite databases.
     *
     * @param entity The OrganizationStrategicInitiative entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    async serializeJsonFieldsForSQLite(entity) {
        // Check if the database is SQLite
        if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
            // Serialize the `signals` field if it's an object
            if (entity.signals && typeof entity.signals === 'object') {
                try {
                    entity.signals = JSON.stringify(entity.signals);
                }
                catch (error) {
                    console.error('OrganizationStrategicInitiativeSubscriber: Error serializing signals:', error.message);
                    // Set to null if serialization fails
                    entity.signals = null;
                }
            }
        }
    }
    /**
     * Called before an OrganizationStrategicInitiative entity is inserted or created in the database.
     *
     * @param entity The OrganizationStrategicInitiative entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Called before an OrganizationStrategicInitiative entity is updated in the database.
     *
     * @param entity The OrganizationStrategicInitiative entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    async beforeEntityUpdate(entity, em) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Handles the parsing of JSON data after the OrganizationStrategicInitiative entity is loaded from the database.
     *
     * @param entity The OrganizationStrategicInitiative entity that has been loaded from the database.
     * @param em The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    async afterEntityLoad(entity, em) {
        // Check if the database is SQLite
        if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
            // Parse the `signals` field if it's a string
            if (entity.signals && typeof entity.signals === 'string') {
                try {
                    entity.signals = JSON.parse(entity.signals);
                }
                catch (error) {
                    // If parsing fails, set to null as signals should be a valid object or null
                    console.error('OrganizationStrategicInitiativeSubscriber: Error parsing signals JSON:', error.message);
                    entity.signals = null;
                }
            }
        }
    }
};
exports.OrganizationStrategicInitiativeSubscriber = OrganizationStrategicInitiativeSubscriber;
exports.OrganizationStrategicInitiativeSubscriber = OrganizationStrategicInitiativeSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], OrganizationStrategicInitiativeSubscriber);
//# sourceMappingURL=organization-strategic-initiative.subscriber.js.map