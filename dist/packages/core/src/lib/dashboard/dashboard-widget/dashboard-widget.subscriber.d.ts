import { BaseEntityEventSubscriber } from '../../core/entities/subscribers/base-entity-event.subscriber';
import { DashboardWidget } from './dashboard-widget.entity';
export declare class DashboardWidgetSubscriber extends BaseEntityEventSubscriber<DashboardWidget> {
    /**
     * Indicates that this subscriber only listens to DashboardWidget events.
     */
    listenTo(): typeof DashboardWidget;
    /**
     * Called before a DashboardWidget entity is inserted or updated in the database.
     * This method prepares the entity for insertion or update by serializing the options property to a JSON string
     * for SQLite databases.
     *
     * @param entity The DashboardWidget entity that is about to be created or updated.
     * @returns {Promise<void>} A promise that resolves when the pre-creation or pre-update processing is complete.
     */
    private serializeOptionsForSQLite;
    /**
     * Called before a DashboardWidget entity is inserted or created in the database.
     * This method prepares the entity for insertion by serializing the options property to a JSON string for SQLite DBs
     *
     * @param entity The DashboardWidget entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    beforeEntityCreate(entity: DashboardWidget): Promise<void>;
    /**
     * Called before a DashboardWidget entity is updated in the database.
     * This method prepares the entity for update by serializing the options property to a JSON string
     *
     * @param entity The DashboardWidget entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: DashboardWidget): Promise<void>;
    /**
     * Handles the parsing of JSON data after the DashboardWidget entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `options` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {DashboardWidget} entity - The DashboardWidget entity that has been loaded from the database.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: DashboardWidget): Promise<void>;
}
