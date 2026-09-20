import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
import { ResourceLink } from './resource-link.entity';
export declare class ResourceLinkSubscriber extends BaseEntityEventSubscriber<ResourceLink> {
    /**
     * Indicates that this subscriber only listen to ResourceLink events.
     */
    listenTo(): typeof ResourceLink;
    /**
     * Called before an ResourceLink entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the metaData property to a JSON string
     * for SQLite databases.
     *
     * @param entity The ResourceLink entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: ResourceLink): Promise<void>;
    /**
     * Handles the parsing of JSON data after the ResourceLink entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `metaData` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {ResourceLink} entity - The ResourceLink entity that has been loaded from the database.
     * @param {MultiOrmEntityManager} [em] - The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: ResourceLink, em?: MultiOrmEntityManager): Promise<void>;
}
