import { IEvent } from '@nestjs/cqrs';
import { IEntitySubscriptionCreateInput } from '@gauzy/contracts';
export declare class CreateEntitySubscriptionEvent implements IEvent {
    readonly input: IEntitySubscriptionCreateInput;
    constructor(input: IEntitySubscriptionCreateInput);
}
