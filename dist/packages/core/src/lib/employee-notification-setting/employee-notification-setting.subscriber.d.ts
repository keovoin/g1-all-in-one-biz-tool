import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { EmployeeNotificationSetting } from './employee-notification-setting.entity';
export declare class EmployeeNotificationSettingSubscriber extends BaseEntityEventSubscriber<EmployeeNotificationSetting> {
    /**
     * Indicates that this subscriber only listen to EmployeeNotificationSetting events.
     */
    listenTo(): typeof EmployeeNotificationSetting;
    /**
     * Called before an EmployeeNotificationSetting entity is inserted or updated in the database.
     * This method prepares the entity for insertion or update by serializing the preferences property to a JSON string
     * for SQLite databases.
     *
     * @param entity The EmployeeNotificationSetting entity that is about to be created or updated.
     * @returns {Promise<void>} A promise that resolves when the pre-creation or pre-update processing is complete.
     */
    private serializePreferencesForSQLite;
    /**
     * Called before an EmployeeNotificationSetting entity is inserted or created in the database.
     * This method prepares the entity for insertion by serializing the preferences property to a JSON string for SQLite DBs
     *
     * @param entity The EmployeeNotificationSetting entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    beforeEntityCreate(entity: EmployeeNotificationSetting): Promise<void>;
    /**
     * Called before an EmployeeNotificationSetting entity is updated in the database.
     * This method prepares the entity for update by serializing the preferences property to a JSON string
     *
     * @param entity The EmployeeNotificationSetting entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: EmployeeNotificationSetting): Promise<void>;
    /**
     * Handles the parsing of JSON data after the EmployeeNotificationSetting entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `preferences` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {EmployeeNotificationSetting} entity - The EmployeeNotificationSetting entity that has been loaded from the database.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: EmployeeNotificationSetting): Promise<void>;
}
