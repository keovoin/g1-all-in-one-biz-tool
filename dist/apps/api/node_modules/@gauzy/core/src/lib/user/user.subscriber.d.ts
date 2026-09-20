import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
import { User } from './user.entity';
export declare class UserSubscriber extends BaseEntityEventSubscriber<User> {
    /**
     * Indicates that this subscriber only listen to User events.
     */
    listenTo(): typeof User;
    /**
     * Called before a User entity is inserted or created in the database. This method ensures
     * that a default image URL is set if one is not provided, and serializes the JSON
     * `uiPreferences` column for SQLite (stored as text there).
     *
     * @param entity The User entity about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: User): Promise<void>;
    /**
     * Called before a User entity is updated through `save()`. Serializes the JSON
     * `uiPreferences` column for SQLite. (Note: TypeORM's `repository.update()` does NOT
     * fire this hook — `UserService.updateUiPreferences` serializes explicitly.)
     *
     * @param entity The User entity about to be updated.
     * @param em Optional entity manager.
     */
    beforeEntityUpdate(entity: User, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * After `save()` on SQLite the entity still holds the JSON STRING the before-hooks wrote for
     * persistence; parse it back so the returned/reused entity has the same shape as a loaded one.
     */
    afterEntityCreate(entity: User): Promise<void>;
    /** See {@link afterEntityCreate}. */
    afterEntityUpdate(entity: User): Promise<void>;
    /**
     * Called after the entity is loaded from the database.
     *
     * @param entity The User entity that has been loaded.
     */
    afterEntityLoad(entity: User): Promise<void>;
    /**
     * Serializes `uiPreferences` to a JSON string on SQLite drivers (the column is `text` there),
     * mirroring `EmployeeSettingSubscriber.serializeDataForSQLite`.
     *
     * @param entity The User entity about to be persisted.
     */
    private serializeUiPreferencesForSQLite;
    /**
     * Parses the `uiPreferences` JSON string back into an object on SQLite drivers.
     *
     * @param entity The User entity that has been loaded.
     */
    private parseUiPreferencesForSQLite;
    /**
     * Simulate an asynchronous operation to set the imageUrl.
     *
     * @param entity
     * @returns
     */
    private setImageUrl;
}
