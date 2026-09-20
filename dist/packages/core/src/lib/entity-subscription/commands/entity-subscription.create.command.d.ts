import { IEntitySubscriptionCreateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class EntitySubscriptionCreateCommand implements ICommand {
    readonly input: IEntitySubscriptionCreateInput;
    static readonly type = "[Subscription] Create";
    constructor(input: IEntitySubscriptionCreateInput);
}
