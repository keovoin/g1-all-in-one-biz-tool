"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEvent = void 0;
const base_entity_event_1 = require("../base-entity-event");
/**
 * Event class representing an task events.
 */
class TaskEvent extends base_entity_event_1.BaseEntityEvent {
    /**
     * Creates an instance of TaskEvent.
     *
     * @param {RequestContext} ctx - The context object containing information about the request.
     * @param {Task} entity - The task entity associated with the event.
     * @param {BaseEntityEventType} type - The type of the event.
     * @param {TaskInputTypes} [input] - Optional input data for the event.
     */
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.TaskEvent = TaskEvent;
//# sourceMappingURL=task.event.js.map