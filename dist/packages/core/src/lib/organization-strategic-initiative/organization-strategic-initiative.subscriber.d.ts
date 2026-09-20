import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
import { OrganizationStrategicInitiative } from './organization-strategic-initiative.entity';
export declare class OrganizationStrategicInitiativeSubscriber extends BaseEntityEventSubscriber<OrganizationStrategicInitiative> {
    /**
     * Indicates that this subscriber only listens to OrganizationStrategicInitiative events.
     */
    listenTo(): typeof OrganizationStrategicInitiative;
    /**
     * Serializes the signals property to a JSON string for SQLite databases.
     *
     * @param entity The OrganizationStrategicInitiative entity that is about to be serialized.
     * @returns {Promise<void>} A promise that resolves when the serialization is complete.
     */
    private serializeJsonFieldsForSQLite;
    /**
     * Called before an OrganizationStrategicInitiative entity is inserted or created in the database.
     *
     * @param entity The OrganizationStrategicInitiative entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: OrganizationStrategicInitiative): Promise<void>;
    /**
     * Called before an OrganizationStrategicInitiative entity is updated in the database.
     *
     * @param entity The OrganizationStrategicInitiative entity that is about to be updated.
     * @returns {Promise<void>} A promise that resolves when the pre-update processing is complete.
     */
    beforeEntityUpdate(entity: OrganizationStrategicInitiative, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Handles the parsing of JSON data after the OrganizationStrategicInitiative entity is loaded from the database.
     *
     * @param entity The OrganizationStrategicInitiative entity that has been loaded from the database.
     * @param em The optional EntityManager instance, if provided.
     * @returns {Promise<void>} A promise that resolves once the after-load processing is complete.
     */
    afterEntityLoad(entity: OrganizationStrategicInitiative, em?: MultiOrmEntityManager): Promise<void>;
}
