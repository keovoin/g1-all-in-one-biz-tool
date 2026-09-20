import { IQuery } from '@nestjs/cqrs';
import { ITaskVersionFindInput } from '@gauzy/contracts';
export declare class FindVersionsQuery implements IQuery {
    readonly options: ITaskVersionFindInput;
    static readonly type = "[Task Versions] Query All";
    constructor(options: ITaskVersionFindInput);
}
