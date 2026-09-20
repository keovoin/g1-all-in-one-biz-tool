import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { Dashboard } from './dashboard.entity';
export declare class DashboardSubscriber extends BaseEntityEventSubscriber<Dashboard> {
    /**
     * Indicates that this subscriber only listen to Dashboard events.
     */
    listenTo(): typeof Dashboard;
    /**
     * Called before an Dashboard entity is inserted or updated in the database.
     * This method prepares the entity for insertion or update by serializing the contentHtml property to a JSON string
     * for SQLite databases.
     *
     * @param entity The Dashboard entity that is about to be created or updated.
     * @returns {Promise<void>} A promise that resolves when the pre-creation or pre-update processing is complete.
     */
    private serializeContentForSQLite;
    /**
     * Called before an Dashboard entity is inserted or created in the database.
     * This method prepares the entity for insertion by serializing the contentHtml property to a JSON string for SQLite DBs
     *
     * @param entity The Dashboard entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    beforeEntityCreate(entity: Dashboard): Promise<void>;
    /**
     * Called before an Dashboard entity is updated in the database.
     * This method prepares the entity for update by serializing the contentHtml property to a JSON string
     *
     * @param entity The Dashboard entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: Dashboard): Promise<void>;
    /**
     * Handles the parsing of JSON data after the Dashboard entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `contentHtml` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {Dashboard} entity - The Dashboard entity that has been loaded from the database.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: Dashboard): Promise<void>;
}
