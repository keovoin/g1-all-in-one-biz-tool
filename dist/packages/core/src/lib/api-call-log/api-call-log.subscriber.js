"use strict";
var ApiCallLogSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCallLogSubscriber = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const api_call_log_entity_1 = require("./api-call-log.entity");
let ApiCallLogSubscriber = ApiCallLogSubscriber_1 = class ApiCallLogSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(ApiCallLogSubscriber_1.name);
    }
    /**
     * Indicates that this subscriber only listen to ApiCallLog events.
     */
    listenTo() {
        return api_call_log_entity_1.ApiCallLog;
    }
    /**
     * Called before an ApiCallLog entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the data property to a JSON string
     * for SQLite databases.
     *
     * @param entity The ApiCallLog entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Check if the database is SQLite and ensure that requestHeaders, requestBody, and responseBody are strings
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                ['requestHeaders', 'requestBody', 'responseBody'].forEach((field) => {
                    try {
                        if (typeof entity[field] === 'object') {
                            entity[field] = JSON.stringify(entity[field]); // Convert to JSON string
                        }
                    }
                    catch (error) {
                        console.error(`Failed to stringify ${field}:`, error);
                        entity[field] = '{}'; // Set to an empty JSON object string in case of an error
                    }
                });
            }
        }
        catch (error) {
            // In case of error during JSON serialization, reset metaData to an empty object
            this.logger.error('Error parsing JSON data in beforeEntityCreate:', error);
        }
    }
    /**
     * Handles the parsing of JSON data after the ApiCallLog entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `data` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {ApiCallLog} entity - The ApiCallLog entity that has been loaded from the database.
     * @param {MultiOrmEntityManager} [em] - The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    async afterEntityLoad(entity, em) {
        try {
            // Check if the database is SQLite and attempt to parse JSON fields
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                ['requestHeaders', 'requestBody', 'responseBody'].forEach((field) => {
                    if (entity[field] && typeof entity[field] === 'string') {
                        try {
                            entity[field] = JSON.parse(entity[field]);
                        }
                        catch (error) {
                            console.error(`Failed to parse ${field}:`, error);
                            entity[field] = {}; // Set to an empty object in case of a parsing error
                        }
                    }
                });
            }
        }
        catch (error) {
            // Log the error and reset the data to an empty object if JSON parsing fails
            this.logger.error('Error parsing JSON data in afterEntityLoad:', error);
        }
    }
};
exports.ApiCallLogSubscriber = ApiCallLogSubscriber;
exports.ApiCallLogSubscriber = ApiCallLogSubscriber = ApiCallLogSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], ApiCallLogSubscriber);
//# sourceMappingURL=api-call-log.subscriber.js.map