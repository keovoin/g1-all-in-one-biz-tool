import { BaseEntityEventSubscriber } from './base-entity-event.subscriber';
import { MultiOrmEntityManager } from './entity-event-subscriber.types';
export declare class BaseEntitySubscriber extends BaseEntityEventSubscriber {
    /**
     * A hook executed before creating an entity. This function can be used to perform
     * custom operations or transformations on the entity prior to its persistence.
     *
     * @param entity - The entity object that is about to be created.
     * @param em - Optional MultiOrmEntityManager for performing additional operations.
     * @returns A promise that resolves when all pre-create operations are complete.
     */
    beforeEntityCreate(entity: any, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * A hook executed before updating an entity. This function can be used to perform
     * custom operations or transformations on the entity prior to its persistence update.
     *
     * @param entity - The entity object that is about to be updated.
     * @param em - Optional MultiOrmEntityManager for additional operations or validations.
     * @returns A promise that resolves when all pre-update operations are complete.
     */
    beforeEntityUpdate(entity: any, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Hook executed after an entity is soft removed (i.e., marked as deleted without being physically removed).
     *
     * @param entity - The entity that was soft removed.
     * @param em - Optional MultiOrmEntityManager for executing additional operations.
     * @returns A promise that resolves when post-soft removal tasks are complete.
     */
    afterEntitySoftRemove(entity: any, em?: MultiOrmEntityManager): Promise<void>;
}
