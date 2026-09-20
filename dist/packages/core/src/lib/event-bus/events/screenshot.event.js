"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotEvent = void 0;
const base_entity_event_1 = require("../base-entity-event");
/**
 * Event class representing an screenshot events.
 */
class ScreenshotEvent extends base_entity_event_1.BaseEntityEvent {
    /**
     * Creates an instance of ScreenshotEvent.
     *
     * @param {RequestContext} ctx - The context object containing information about the request.
     * @param {Screenshot} entity - The screenshot entity associated with the event.
     * @param {BaseEntityEventType} type - The type of the event.
     * @param {ScreenshotInputTypes} [input] - Optional input data for the event.
     */
    constructor(ctx, entity, type, input, data, file) {
        super(entity, type, ctx, input);
        this.file = file;
        this.data = data;
    }
}
exports.ScreenshotEvent = ScreenshotEvent;
//# sourceMappingURL=screenshot.event.js.map