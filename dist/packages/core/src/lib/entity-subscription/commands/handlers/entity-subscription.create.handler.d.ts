import { IEntitySubscription } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { EntitySubscriptionCreateCommand } from '../entity-subscription.create.command';
import { EntitySubscriptionService } from '../../entity-subscription.service';
export declare class EntitySubscriptionCreateHandler implements ICommandHandler<EntitySubscriptionCreateCommand> {
    private readonly subscriptionService;
    constructor(subscriptionService: EntitySubscriptionService);
    execute(command: EntitySubscriptionCreateCommand): Promise<IEntitySubscription>;
}
