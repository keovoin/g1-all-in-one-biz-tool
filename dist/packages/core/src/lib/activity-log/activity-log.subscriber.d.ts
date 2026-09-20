import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
import { ActivityLog } from './activity-log.entity';
export declare class ActivityLogSubscriber extends BaseEntityEventSubscriber<ActivityLog> {
    /**
     * Indicates that this subscriber only listen to ActivityLog events.
     */
    listenTo(): typeof ActivityLog;
    /**
     * @description Serialize Activity Log fields to support SQLite DB before creation
     * @param {ActivityLog} entity - The ActivityLog entity that is about to be created or updated.
     * @param {string[]} fields - Array fields to be serialized
     */
    private serializeFields;
    /**
     * @description de-serialize Activity Log fields to support SQLite DB after load data
     * @param {ActivityLog} entity - The ActivityLog entity that is about to be loaded or updated.
     * @param {string[]} fields - Array fields to be de-serialized
     */
    private deserializeFields;
    /**
     * Called before an ActivityLog entity is inserted or updated in the database.
     * This method prepares the entity for insertion or update by serializing the data property to a JSON string
     * for SQLite databases.
     *
     * @param entity The ActivityLog entity that is about to be created or updated.
     * @returns {Promise<void>} A promise that resolves when the pre-creation or pre-update processing is complete.
     */
    serializeDataForSQLite(entity: ActivityLog): Promise<void>;
    /**
     * Called before an ActivityLog entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the data property to a JSON string
     *
     * @param entity The ActivityLog entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    beforeEntityCreate(entity: ActivityLog): Promise<void>;
    /**
     * Called before an ActivityLog entity is updated in the database.
     * This method prepares the entity for update, particularly by serializing the data property to a JSON string
     *
     * @param entity The ActivityLog entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: ActivityLog): Promise<void>;
    /**
     * Handles the parsing of JSON data after the ActivityLog entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `data` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {ActivityLog} entity - The ActivityLog entity that has been loaded from the database.
     * @param {MultiOrmEntityManager} [em] - The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: ActivityLog, em?: MultiOrmEntityManager): Promise<void>;
}
