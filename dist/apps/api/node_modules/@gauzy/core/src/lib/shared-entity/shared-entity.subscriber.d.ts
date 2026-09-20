import { BaseEntityEventSubscriber } from "../core/entities/subscribers/base-entity-event.subscriber";
import { MultiOrmEntityManager } from "../core/entities/subscribers/entity-event-subscriber.types";
import { SharedEntity } from "./shared-entity.entity";
export declare class SharedEntitySubscriber extends BaseEntityEventSubscriber<SharedEntity> {
    /**
     * Indicates that this subscriber only listen to SharedEntity events.
     */
    listenTo(): typeof SharedEntity;
    /**
     * Serializes the shareRules and sharedOptions properties to a JSON string for SQLite databases.
     *
     * @param entity The SharedEntity entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    private serializeShareRulesAndSharedOptionsForSQLite;
    /**
     * Called before a SharedEntity entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the shareRules and sharedOptions properties to a JSON string
     * for SQLite databases.
     *
     * @param entity The SharedEntity entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: SharedEntity): Promise<void>;
    /**
     * Called before a SharedEntity entity is updated in the database.
     * This method prepares the entity for update, particularly by serializing the shareRules and sharedOptions properties to a JSON string
     * for SQLite databases.
     *
     * @param entity The SharedEntity entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: SharedEntity, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Handles the parsing of JSON data after the SharedEntity entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `shareRules` and `sharedOptions` fields, stored as a JSON string,
     * are parsed back into a JavaScript object.
     *
     * @param entity The SharedEntity entity that has been loaded from the database.
     * @param em The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: SharedEntity, em?: MultiOrmEntityManager): Promise<void>;
}
