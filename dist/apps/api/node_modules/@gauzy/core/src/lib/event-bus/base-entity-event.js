"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntityEvent = exports.BaseEntityEventTypeEnum = void 0;
const base_event_1 = require("./base-event");
/**
 * Enum representing the possible types of BaseEntity events.
 */
var BaseEntityEventTypeEnum;
(function (BaseEntityEventTypeEnum) {
    BaseEntityEventTypeEnum["CREATED"] = "created";
    BaseEntityEventTypeEnum["UPDATED"] = "updated";
    BaseEntityEventTypeEnum["DELETED"] = "deleted";
})(BaseEntityEventTypeEnum || (exports.BaseEntityEventTypeEnum = BaseEntityEventTypeEnum = {}));
/**
 * Abstract class representing a base event for entities with generic types for the entity and input data.
 */
class BaseEntityEvent extends base_event_1.BaseEvent {
    /**
     * Constructor for the BaseEntityEvent class.
     *
     * @param entity The entity associated with the event.
     * @param type The type of event (created, updated, deleted, etc.).
     * @param ctx The request context associated with the event.
     * @param input Optional input data associated with the event.
     */
    constructor(entity, type, ctx, input) {
        super();
        this.entity = entity;
        this.type = type;
        this.ctx = ctx;
        this.input = input;
    }
}
exports.BaseEntityEvent = BaseEntityEvent;
//# sourceMappingURL=base-entity-event.js.map