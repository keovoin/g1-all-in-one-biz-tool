import { ICommand } from '@nestjs/cqrs';
import { ID, IDashboardUpdateInput } from '@gauzy/contracts';
export declare class DashboardUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IDashboardUpdateInput;
    static readonly type = "[Dashboard] Update";
    constructor(id: ID, input: IDashboardUpdateInput);
}
