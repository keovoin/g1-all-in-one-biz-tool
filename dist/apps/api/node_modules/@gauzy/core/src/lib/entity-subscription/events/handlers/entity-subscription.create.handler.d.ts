import { CommandBus, IEventHandler } from '@nestjs/cqrs';
import { IEntitySubscription } from '@gauzy/contracts';
import { CreateEntitySubscriptionEvent } from '../entity-subscription.create.event';
export declare class CreateSubscriptionHandler implements IEventHandler<CreateEntitySubscriptionEvent> {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    /**
     * Handles a subscription creation event.
     *
     * Extracts subscription details from the event input and uses the command bus to execute a EntitySubscriptionCreateCommand,
     * which creates a new subscription for the specified entity.
     *
     * @param {CreateEntitySubscriptionEvent} event - The event containing the input data for subscription creation.
     * @returns {Promise<IEntitySubscription>} A promise that resolves to the created subscription.
     * @throws An error if the subscription creation process fails.
     */
    handle(event: CreateEntitySubscriptionEvent): Promise<IEntitySubscription>;
}
