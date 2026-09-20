import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
import { EmployeeSetting } from './employee-setting.entity';
export declare class EmployeeSettingSubscriber extends BaseEntityEventSubscriber<EmployeeSetting> {
    /**
     * Indicates that this subscriber only listen to EmployeeSetting events.
     */
    listenTo(): typeof EmployeeSetting;
    /**
     * Serializes the data and defaultData properties to a JSON string for SQLite databases.
     *
     * @param entity The EmployeeSetting entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    private serializeDataForSQLite;
    /**
     * Called before an EmployeeSetting entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the data property to a JSON string for SQLite DBs
     *
     * @param entity The EmployeeSetting entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    beforeEntityCreate(entity: EmployeeSetting): Promise<void>;
    /**
     * Called before an EmployeeSetting entity is updated in the database.
     * This method prepares the entity for update, particularly by serializing the data property to a JSON string
     *
     * @param entity The EmployeeSetting entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: EmployeeSetting, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Handles the parsing of JSON data after the EmployeeSetting entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `data` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param {EmployeeSetting} entity - The EmployeeSetting entity that has been loaded from the database.
     * @param {MultiOrmEntityManager} [em] - The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: EmployeeSetting, em?: MultiOrmEntityManager): Promise<void>;
}
