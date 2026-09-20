import { ICommand } from '@nestjs/cqrs';
import { IDashboardCreateInput } from '@gauzy/contracts';
export declare class DashboardCreateCommand implements ICommand {
    readonly input: IDashboardCreateInput;
    static readonly type = "[Dashboard] Create";
    constructor(input: IDashboardCreateInput);
}
