"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const utils_1 = require("../core/utils");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const user_entity_1 = require("./user.entity");
let UserSubscriber = class UserSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to User events.
     */
    listenTo() {
        return user_entity_1.User;
    }
    /**
     * Called before a User entity is inserted or created in the database. This method ensures
     * that a default image URL is set if one is not provided, and serializes the JSON
     * `uiPreferences` column for SQLite (stored as text there).
     *
     * @param entity The User entity about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Set a default imageUrl using a dummy image if not already provided
            entity.imageUrl = entity.imageUrl || (0, utils_1.getUserDummyImage)(entity);
            this.serializeUiPreferencesForSQLite(entity);
        }
        catch (error) {
            console.error('UserSubscriber: Error during the beforeEntityCreate process:', error);
        }
    }
    /**
     * Called before a User entity is updated through `save()`. Serializes the JSON
     * `uiPreferences` column for SQLite. (Note: TypeORM's `repository.update()` does NOT
     * fire this hook — `UserService.updateUiPreferences` serializes explicitly.)
     *
     * @param entity The User entity about to be updated.
     * @param em Optional entity manager.
     */
    async beforeEntityUpdate(entity, em) {
        try {
            this.serializeUiPreferencesForSQLite(entity);
        }
        catch (error) {
            console.error('UserSubscriber: Error during the beforeEntityUpdate process:', error);
        }
    }
    /**
     * After `save()` on SQLite the entity still holds the JSON STRING the before-hooks wrote for
     * persistence; parse it back so the returned/reused entity has the same shape as a loaded one.
     */
    async afterEntityCreate(entity) {
        this.parseUiPreferencesForSQLite(entity);
    }
    /** See {@link afterEntityCreate}. */
    async afterEntityUpdate(entity) {
        this.parseUiPreferencesForSQLite(entity);
    }
    /**
     * Called after the entity is loaded from the database.
     *
     * @param entity The User entity that has been loaded.
     */
    async afterEntityLoad(entity) {
        try {
            // Combine first name and last name into a full name, if they exist.
            entity.name = [entity.firstName, entity.lastName].filter(Boolean).join(' ');
            // Set isEmailVerified to true if the emailVerifiedAt property exists and has a truthy value.
            if (Object.prototype.hasOwnProperty.call(entity, 'emailVerifiedAt')) {
                entity.isEmailVerified = !!entity.emailVerifiedAt;
            }
            // SQLite stores the JSON `uiPreferences` column as text — hand the API an object.
            this.parseUiPreferencesForSQLite(entity);
            // Set imageUrl from the image object's fullUrl, if available. Fall back to existing imageUrl if not.
            if (Object.prototype.hasOwnProperty.call(entity, 'image')) {
                await this.setImageUrl(entity);
            }
        }
        catch (error) {
            // Log any errors encountered during the execution of the function.
            console.error('Error in UserSubscriber afterEntityLoad hook:', error);
        }
    }
    /**
     * Serializes `uiPreferences` to a JSON string on SQLite drivers (the column is `text` there),
     * mirroring `EmployeeSettingSubscriber.serializeDataForSQLite`.
     *
     * @param entity The User entity about to be persisted.
     */
    serializeUiPreferencesForSQLite(entity) {
        if (!((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)())) {
            return;
        }
        try {
            if (entity.uiPreferences && typeof entity.uiPreferences === 'object') {
                entity.uiPreferences = JSON.stringify(entity.uiPreferences);
            }
        }
        catch (error) {
            console.error('UserSubscriber: Error stringify uiPreferences:', error);
            entity.uiPreferences = '{}';
        }
    }
    /**
     * Parses the `uiPreferences` JSON string back into an object on SQLite drivers.
     *
     * @param entity The User entity that has been loaded.
     */
    parseUiPreferencesForSQLite(entity) {
        if (!((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)())) {
            return;
        }
        try {
            if (entity.uiPreferences && typeof entity.uiPreferences === 'string') {
                entity.uiPreferences = JSON.parse(entity.uiPreferences);
            }
        }
        catch (error) {
            console.error('UserSubscriber: Error parsing uiPreferences JSON:', error);
            entity.uiPreferences = {};
        }
    }
    /**
     * Simulate an asynchronous operation to set the imageUrl.
     *
     * @param entity
     * @returns
     */
    setImageUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation, e.g., fetching fullUrl from a service
                setTimeout(() => {
                    entity.imageUrl = entity.image?.fullUrl ?? entity.imageUrl;
                    resolve();
                });
            }
            catch (error) {
                console.error('UserSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.UserSubscriber = UserSubscriber;
exports.UserSubscriber = UserSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], UserSubscriber);
//# sourceMappingURL=user.subscriber.js.map