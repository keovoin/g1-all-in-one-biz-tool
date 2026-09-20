"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const screenshot_entity_1 = require("./screenshot.entity");
const file_storage_1 = require("./../../core/file-storage");
const utils_2 = require("./../../core/utils");
const entity_event_subscriber_types_1 = require("../../core/entities/subscribers/entity-event-subscriber.types");
let ScreenshotSubscriber = class ScreenshotSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Screenshot events.
     */
    listenTo() {
        return screenshot_entity_1.Screenshot;
    }
    /**
     * Gets database connection options based on the entity manager type.
     *
     * @param em The entity manager (TypeORM or MikroORM)
     * @returns The database connection options
     */
    getDbOptions(em) {
        if (em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager) {
            return em.connection?.options || (0, config_1.getConfig)().dbConnectionOptions;
        }
        return (0, config_1.getConfig)().dbMikroOrmConnectionOptions;
    }
    /**
     * Validates the entity manager matches the expected ORM type.
     *
     * @param em The entity manager to validate
     * @param ormType The expected ORM type
     * @returns True if the entity manager matches the expected ORM type
     */
    isValidEntityManager(em, ormType) {
        if (!em)
            return false;
        switch (ormType) {
            case utils_2.MultiORMEnum.TypeORM:
                return em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager;
            case utils_2.MultiORMEnum.MikroORM:
                return em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager;
            default:
                return false;
        }
    }
    /**
     * Converts the apps property to a JSON string for SQLite databases.
     *
     * @param entity The Screenshot entity
     * @param options The database connection options
     */
    stringifyAppsForSqlite(entity, options) {
        if ((0, utils_2.isSqliteDB)(options) && (0, utils_1.isObject)(entity.apps)) {
            try {
                entity.apps = JSON.stringify(entity.apps);
            }
            catch (error) {
                // Handle the error appropriately, set a default value
                entity.apps = JSON.stringify([]);
            }
        }
    }
    /**
     * Parses the apps property from a JSON string for SQLite databases.
     *
     * @param entity The Screenshot entity
     * @param options The database connection options
     */
    parseAppsForSqlite(entity, options) {
        if ((0, utils_2.isSqliteDB)(options) && typeof entity.apps === 'string') {
            try {
                entity.apps = JSON.parse(entity.apps);
            }
            catch (error) {
                console.error('ScreenshotSubscriber: JSON parse error while parsing apps:', error);
                entity.apps = [];
            }
        }
    }
    /**
     * Populates the fullUrl and thumbUrl properties from storage.
     *
     * @param entity The Screenshot entity
     */
    async populateFileUrls(entity) {
        const { storageProvider, file, thumb } = entity;
        const instance = new file_storage_1.FileStorage().setProvider(storageProvider).getProviderInstance();
        // Retrieve URLs concurrently
        const [fullUrl, thumbUrl] = await Promise.all([instance.url(file), instance.url(thumb)]);
        entity.fullUrl = fullUrl;
        entity.thumbUrl = thumbUrl;
    }
    /**
     * Called before a Screenshot entity is created in the database.
     * This method prepares the entity for creation, including handling database-specific logic such as converting certain properties to JSON
     * strings for SQLite databases.
     *
     * @param entity The Screenshot entity about to be created.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity, em) {
        try {
            if (!(entity instanceof screenshot_entity_1.Screenshot)) {
                return; // Early exit if the entity is not a Screenshot
            }
            // Get ORM type dynamically at runtime to ensure correct environment selection
            const ormType = (0, utils_2.getORMType)();
            // Validate entity manager matches the ORM type
            if (!this.isValidEntityManager(em, ormType)) {
                return;
            }
            // Get database options and stringify apps for SQLite
            const options = this.getDbOptions(em);
            this.stringifyAppsForSqlite(entity, options);
        }
        catch (error) {
            console.error('ScreenshotSubscriber: An error occurred during the beforeEntityCreate process:', error.message);
        }
    }
    /**
     * Called before a Screenshot entity is updated in the database.
     * This method prepares the entity for update, including converting certain properties to JSON strings for specific database types.
     *
     * @param entity The Screenshot entity about to be updated.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    async beforeEntityUpdate(entity, em) {
        try {
            if (!(entity instanceof screenshot_entity_1.Screenshot)) {
                return; // Early exit if the entity is not a Screenshot
            }
            // Get ORM type dynamically at runtime to ensure correct environment selection
            const ormType = (0, utils_2.getORMType)();
            // Validate entity manager matches the ORM type
            if (!this.isValidEntityManager(em, ormType)) {
                return;
            }
            // Get database options and stringify apps for SQLite
            const options = this.getDbOptions(em);
            this.stringifyAppsForSqlite(entity, options);
        }
        catch (error) {
            console.error('ScreenshotSubscriber: An error occurred during the beforeEntityUpdate process:', error.message);
        }
    }
    /**
     * Called after a Screenshot entity is loaded from the database. This method performs additional
     * processing such as retrieving file URLs from a storage provider and handling specific data formats based on the database type.
     *
     * @param entity The loaded Screenshot entity.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM.
     * @returns {Promise<void>} A promise that resolves when the additional processing is complete.
     */
    async afterEntityLoad(entity, em) {
        try {
            if (!(entity instanceof screenshot_entity_1.Screenshot)) {
                return; // Early exit if the entity is not a Screenshot
            }
            // Get ORM type dynamically at runtime to ensure correct environment selection
            const ormType = (0, utils_2.getORMType)();
            // Validate entity manager matches the ORM type
            if (!this.isValidEntityManager(em, ormType)) {
                return;
            }
            // Populate file URLs from storage
            await this.populateFileUrls(entity);
            // Get database options and parse apps for SQLite
            const options = this.getDbOptions(em);
            this.parseAppsForSqlite(entity, options);
        }
        catch (error) {
            console.error('ScreenshotSubscriber: An error occurred during the afterEntityLoad process:', error.message);
        }
    }
    /**
     * Called after a Screenshot entity is deleted from the database.
     * This method handles the deletion of associated files (both the main file and its thumbnail) from the storage system.
     *
     * @param entity The Screenshot entity that was deleted.
     * @returns {Promise<void>} A promise that resolves when the file deletion operations are complete.
     */
    async afterEntityDelete(entity) {
        try {
            if (!(entity instanceof screenshot_entity_1.Screenshot)) {
                return; // Early exit if the entity is not a Screenshot
            }
            const { id: entityId, storageProvider, file, thumb } = entity;
            console.log(`AFTER SCREENSHOT ENTITY WITH ID ${entityId} REMOVED`);
            console.log('ScreenshotSubscriber: Deleting files...', file, thumb);
            // Initialize the file storage instance with the provided storage provider.
            const instance = new file_storage_1.FileStorage().setProvider(storageProvider).getProviderInstance();
            console.log('ScreenshotSubscriber: Instance initialized', instance);
            // Deleting both the main file and the thumbnail, if they exist.
            await Promise.all([file && instance.deleteFile(file), thumb && instance.deleteFile(thumb)]);
        }
        catch (error) {
            console.error(`ScreenshotSubscriber: Error deleting files for entity ID ${entity?.id}:`, error.message);
        }
    }
    /**
     * Called after entity is soft removed from the database.
     * This method handles the removal of associated files (both the main file and its thumbnail) from the storage system.
     *
     * @param entity The entity that was soft removed.
     * @returns {Promise<void>} A promise that resolves when the file soft removal operations are complete.
     */
    async afterEntitySoftRemove(entity) {
        try {
            if (!(entity instanceof screenshot_entity_1.Screenshot)) {
                return; // Early exit if the entity is not a Screenshot
            }
            const { id: entityId, file, thumb } = entity;
            console.log(`AFTER SCREENSHOT ENTITY WITH ID ${entityId} SOFT REMOVED`);
            console.log('ScreenshotSubscriber: Soft removing files...', file, thumb);
        }
        catch (error) {
            console.error(`ScreenshotSubscriber: Error soft removing entity ID ${entity?.id}:`, error.message);
        }
    }
};
exports.ScreenshotSubscriber = ScreenshotSubscriber;
exports.ScreenshotSubscriber = ScreenshotSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], ScreenshotSubscriber);
//# sourceMappingURL=screenshot.subscriber.js.map