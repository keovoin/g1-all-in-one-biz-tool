import { ID } from '@gauzy/contracts';
/**
 * Abstract base class for representing events in an event-driven architecture.
 */
export declare abstract class BaseEvent {
    /**
     * Readonly property representing the unique ID of the event.
     */
    readonly id: ID;
    /**
     * Readonly property representing the creation timestamp of the event.
     */
    readonly createdAt: Date;
    /**
     * Constructor for the BaseEvent class.
     * Initializes the `id` with a new UUID and `createdAt` with the current date and time.
     */
    constructor();
}
