import { IBulkActivitiesInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class BulkActivitiesSaveCommand implements ICommand {
    readonly input: IBulkActivitiesInput;
    static readonly type = "[Activity] Bulk Create Activities";
    constructor(input: IBulkActivitiesInput);
}
