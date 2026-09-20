"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const time_off_request_entity_1 = require("./time-off-request.entity");
let TimeOffRequestSubscriber = class TimeOffRequestSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to TimeOffRequest events.
     */
    listenTo() {
        return time_off_request_entity_1.TimeOffRequest;
    }
    /**
     * Called after a TimeOffRequest entity is loaded from the database. This method updates
     * the entity's document URL if an associated document with a full URL is present.
     *
     * @param entity The TimeOffRequest entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Check if the entity has an associated document with a full URL and update the document URL
            if (entity.document && entity.document.fullUrl) {
                entity.documentUrl = entity.document.fullUrl;
            }
        }
        catch (error) {
            console.error('TimeOffRequestSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
};
exports.TimeOffRequestSubscriber = TimeOffRequestSubscriber;
exports.TimeOffRequestSubscriber = TimeOffRequestSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TimeOffRequestSubscriber);
//# sourceMappingURL=time-off-request.subscriber.js.map