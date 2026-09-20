import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
import { Broadcast } from './broadcast.entity';
export declare class BroadcastSubscriber extends BaseEntityEventSubscriber<Broadcast> {
    /**
     * Indicates that this subscriber only listen to Broadcast events.
     */
    listenTo(): typeof Broadcast;
    /**
     * Serializes the content and audienceRules properties to a JSON string for SQLite databases.
     *
     * @param entity The Broadcast entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    private serializeJsonFieldsForSQLite;
    /**
     * Called before a Broadcast entity is inserted or created in the database.
     *
     * @param entity The Broadcast entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: Broadcast): Promise<void>;
    /**
     * Called before a Broadcast entity is updated in the database.
     *
     * @param entity The Broadcast entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: Broadcast, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Handles the parsing of JSON data after the Broadcast entity is loaded from the database.
     *
     * @param entity The Broadcast entity that has been loaded from the database.
     * @param em The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: Broadcast, em?: MultiOrmEntityManager): Promise<void>;
}
