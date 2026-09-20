"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEvent = void 0;
const uuid_1 = require("uuid");
/**
 * Abstract base class for representing events in an event-driven architecture.
 */
class BaseEvent {
    /**
     * Constructor for the BaseEvent class.
     * Initializes the `id` with a new UUID and `createdAt` with the current date and time.
     */
    constructor() {
        this.id = (0, uuid_1.v4)(); // Generate a new UUID
        this.createdAt = new Date();
    }
}
exports.BaseEvent = BaseEvent;
//# sourceMappingURL=base-event.js.map