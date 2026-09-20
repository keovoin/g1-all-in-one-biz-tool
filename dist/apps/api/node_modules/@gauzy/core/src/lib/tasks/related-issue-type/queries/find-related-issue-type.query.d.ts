import { IQuery } from '@nestjs/cqrs';
import { ITaskStatusFindInput } from '@gauzy/contracts';
export declare class FindRelatedIssueTypesQuery implements IQuery {
    readonly options: ITaskStatusFindInput;
    static readonly type = "[Task RelatedIssueTypes] Query All";
    constructor(options: ITaskStatusFindInput);
}
