import { IQuery } from '@nestjs/cqrs';
import { ITaskStatusFindInput } from '@gauzy/contracts';
export declare class FindStatusesQuery implements IQuery {
    readonly options: ITaskStatusFindInput;
    static readonly type = "[Task Statuses] Query All";
    constructor(options: ITaskStatusFindInput);
}
