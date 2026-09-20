"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEvent = void 0;
const base_entity_event_1 = require("../base-entity-event");
/**
 * Event class representing an integration events.
 */
class IntegrationEvent extends base_entity_event_1.BaseEntityEvent {
    /**
     * Creates an instance of IntegrationEvent.
     *
     * @param {RequestContext} ctx - The context object containing information about the request.
     * @param {IntegrationTenant} entity - The entity associated with the event.
     * @param {BaseEntityEventType} type - The type of the event.
     * @param {IntegrationInputTypes} [input] - Optional input data for the event.
     */
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.IntegrationEvent = IntegrationEvent;
//# sourceMappingURL=integration.event.js.map