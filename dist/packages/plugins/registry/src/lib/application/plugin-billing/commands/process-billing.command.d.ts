import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ProcessBillingCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Plugin Subscription] Process Billing";
    constructor(id: ID);
}
