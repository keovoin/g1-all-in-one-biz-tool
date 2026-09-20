import { BaseEntityEventSubscriber } from "../core/entities/subscribers/base-entity-event.subscriber";
import { MultiOrmEntityManager } from "../core/entities/subscribers/entity-event-subscriber.types";
import { EmployeeRecentVisit } from "./employee-recent-visit.entity";
export declare class EmployeeRecentVisitSubscriber extends BaseEntityEventSubscriber<EmployeeRecentVisit> {
    /**
     * Indicates that this subscriber only listen to EmployeeRecentVisit events.
     */
    listenTo(): typeof EmployeeRecentVisit;
    /**
     * Serializes the data property to a JSON string for SQLite databases.
     *
     * @param entity The EmployeeRecentVisit entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    private serializeDataForSQLite;
    /**
     * Called before an EmployeeRecentVisit entity is inserted or created in the database.
     * This method prepares the entity for insertion, particularly by serializing the data property to a JSON string
     * for SQLite databases.
     *
     * @param entity The EmployeeRecentVisit entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: EmployeeRecentVisit): Promise<void>;
    /**
     * Called before an EmployeeRecentVisit entity is updated in the database.
     * This method prepares the entity for update, particularly by serializing the data property to a JSON string
     * for SQLite databases.
     *
     * @param entity The EmployeeRecentVisit entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: EmployeeRecentVisit, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Handles the parsing of JSON data after the EmployeeRecentVisit entity is loaded from the database.
     * This function ensures that if the database is SQLite, the `data` field, stored as a JSON string,
     * is parsed back into a JavaScript object.
     *
     * @param entity The EmployeeRecentVisit entity that has been loaded from the database.
     * @param em The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: EmployeeRecentVisit, em?: MultiOrmEntityManager): Promise<void>;
}
