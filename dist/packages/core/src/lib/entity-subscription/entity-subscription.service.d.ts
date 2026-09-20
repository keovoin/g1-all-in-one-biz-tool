import { DeleteResult } from 'typeorm';
import { ID, IEntitySubscription, IEntitySubscriptionCreateInput, IEntitySubscriptionFindInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { EntitySubscription } from './entity-subscription.entity';
import { MikroOrmEntitySubscriptionRepository } from './repository/mikro-orm-entity-subscription.repository';
import { TypeOrmEntitySubscriptionRepository } from './repository/type-orm-entity-subscription.repository';
export declare class EntitySubscriptionService extends TenantAwareCrudService<EntitySubscription> {
    readonly typeOrmEntitySubscriptionRepository: TypeOrmEntitySubscriptionRepository;
    readonly mikroOrmEntitySubscriptionRepository: MikroOrmEntitySubscriptionRepository;
    constructor(typeOrmEntitySubscriptionRepository: TypeOrmEntitySubscriptionRepository, mikroOrmEntitySubscriptionRepository: MikroOrmEntitySubscriptionRepository);
    /**
     * Creates a new subscription for the specified entity and user.
     *
     * @param {IEntitySubscriptionCreateInput} input - The input object containing subscription details, including the entity type, entity ID, and optional tenant ID.
     * @returns {Promise<IEntitySubscription>} A promise resolving to the created subscription, or the existing subscription if it already exists.
     * @throws {BadRequestException} Throws a BadRequestException if the subscription creation fails due to an error.
     */
    create(input: IEntitySubscriptionCreateInput): Promise<IEntitySubscription>;
    /**
     * Unsubscribes a user from a specific entity by deleting the corresponding subscription.
     *
     * @param {ID} id - The unique identifier of the subscription to delete.
     * @param {IEntitySubscriptionFindInput} options - Additional options to refine the deletion query.
     *   - `entity`: The type of entity the subscription is associated with (e.g., "project").
     *   - `entityId`: The unique identifier of the associated entity.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     *
     * @throws {BadRequestException} Throws an exception if an error occurs during the unsubscribe process.
     */
    unsubscribe(id: ID, input?: IEntitySubscriptionFindInput): Promise<DeleteResult>;
}
