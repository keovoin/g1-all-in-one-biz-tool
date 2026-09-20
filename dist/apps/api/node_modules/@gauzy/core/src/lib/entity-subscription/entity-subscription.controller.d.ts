import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination, IEntitySubscription } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from './../core/crud';
import { EntitySubscription } from './entity-subscription.entity';
import { EntitySubscriptionService } from './entity-subscription.service';
import { CreateEntitySubscriptionDTO, EntitySubscriptionFindInputDTO } from './dto';
export declare class EntitySubscriptionController extends CrudController<EntitySubscription> {
    private readonly _entitySubscriptionService;
    private readonly _commandBus;
    constructor(_entitySubscriptionService: EntitySubscriptionService, _commandBus: CommandBus);
    /**
     * Retrieve all subscriptions with optional filtering and pagination.
     *
     * Fetches a paginated list of subscriptions, applying any filtering options provided via query parameters.
     *
     * @param params - The pagination and filtering parameters for querying subscriptions.
     * @returns A promise that resolves to a paginated list of subscriptions.
     */
    findAll(params: BaseQueryDTO<EntitySubscription>): Promise<IPagination<IEntitySubscription>>;
    /**
     * Find subscription by ID.
     *
     * Retrieves a subscription record using its unique identifier. Optional query parameters can be used
     * to filter or modify the data retrieval.
     *
     * @param id - The unique identifier (UUID) of the subscription.
     * @param params - Optional query parameters for additional filtering.
     * @returns A promise that resolves to the found subscription entity.
     */
    findById(id: ID, params: FindOptionsQueryDTO<EntitySubscription>): Promise<IEntitySubscription>;
    /**
     * Subscribe to an entity.
     *
     * Creates a new subscription for an entity using the provided subscription details.
     *
     * @param entity - The subscription details required to create a new subscription.
     * @returns The newly created entity subscription.
     */
    create(entity: CreateEntitySubscriptionDTO): Promise<IEntitySubscription>;
    /**
     * Unsubscribe from an entity.
     *
     * Removes a subscription based on the provided subscription ID along with any additional query filters.
     *
     * @param id - The UUID of the subscription to be deleted.
     * @param options - Optional query parameters to help locate the subscription.
     * @returns A promise that resolves with the delete result.
     */
    delete(id: ID, params: EntitySubscriptionFindInputDTO): Promise<DeleteResult>;
}
