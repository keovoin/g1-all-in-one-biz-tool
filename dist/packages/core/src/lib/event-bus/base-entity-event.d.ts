import { RequestContext } from '../core/context';
import { BaseEvent } from './base-event';
/**
 * Type representing the possible types of BaseEntity events.
 */
export type BaseEntityEventType = 'created' | 'updated' | 'deleted';
/**
 * Enum representing the possible types of BaseEntity events.
 */
export declare enum BaseEntityEventTypeEnum {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted"
}
/**
 * Abstract class representing a base event for entities with generic types for the entity and input data.
 */
export declare abstract class BaseEntityEvent<Entity, Input = any> extends BaseEvent {
    readonly entity: Entity;
    readonly type: BaseEntityEventType;
    readonly ctx: RequestContext;
    readonly input?: Input;
    /**
     * Constructor for the BaseEntityEvent class.
     *
     * @param entity The entity associated with the event.
     * @param type The type of event (created, updated, deleted, etc.).
     * @param ctx The request context associated with the event.
     * @param input Optional input data associated with the event.
     */
    protected constructor(entity: Entity, type: BaseEntityEventType, ctx: RequestContext, input?: Input);
}
