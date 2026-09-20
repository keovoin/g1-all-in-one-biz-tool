import { BaseEntityEventSubscriber } from '../../core/entities/subscribers/base-entity-event.subscriber';
import { Screenshot } from './screenshot.entity';
import { MultiOrmEntityManager } from '../../core/entities/subscribers/entity-event-subscriber.types';
export declare class ScreenshotSubscriber extends BaseEntityEventSubscriber<Screenshot> {
    /**
     * Indicates that this subscriber only listen to Screenshot events.
     */
    listenTo(): typeof Screenshot;
    /**
     * Gets database connection options based on the entity manager type.
     *
     * @param em The entity manager (TypeORM or MikroORM)
     * @returns The database connection options
     */
    private getDbOptions;
    /**
     * Validates the entity manager matches the expected ORM type.
     *
     * @param em The entity manager to validate
     * @param ormType The expected ORM type
     * @returns True if the entity manager matches the expected ORM type
     */
    private isValidEntityManager;
    /**
     * Converts the apps property to a JSON string for SQLite databases.
     *
     * @param entity The Screenshot entity
     * @param options The database connection options
     */
    private stringifyAppsForSqlite;
    /**
     * Parses the apps property from a JSON string for SQLite databases.
     *
     * @param entity The Screenshot entity
     * @param options The database connection options
     */
    private parseAppsForSqlite;
    /**
     * Populates the fullUrl and thumbUrl properties from storage.
     *
     * @param entity The Screenshot entity
     */
    private populateFileUrls;
    /**
     * Called before a Screenshot entity is created in the database.
     * This method prepares the entity for creation, including handling database-specific logic such as converting certain properties to JSON
     * strings for SQLite databases.
     *
     * @param entity The Screenshot entity about to be created.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: Screenshot, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Called before a Screenshot entity is updated in the database.
     * This method prepares the entity for update, including converting certain properties to JSON strings for specific database types.
     *
     * @param entity The Screenshot entity about to be updated.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: Screenshot, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Called after a Screenshot entity is loaded from the database. This method performs additional
     * processing such as retrieving file URLs from a storage provider and handling specific data formats based on the database type.
     *
     * @param entity The loaded Screenshot entity.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the additional processing is complete.
     */
    afterEntityLoad(entity: Screenshot, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Called after a Screenshot entity is deleted from the database.
     * This method handles the deletion of associated files (both the main file and its thumbnail) from the storage system.
     *
     * @param entity The Screenshot entity that was deleted.
     * @returns {Promise<void>} A promise that resolves when the file deletion operations are complete.
     */
    afterEntityDelete(entity: Screenshot): Promise<void>;
    /**
     * Called after entity is soft removed from the database.
     * This method handles the removal of associated files (both the main file and its thumbnail) from the storage system.
     *
     * @param entity The entity that was soft removed.
     * @returns {Promise<void>} A promise that resolves when the file soft removal operations are complete.
     */
    afterEntitySoftRemove(entity: Screenshot): Promise<void>;
}
