import { IEmailResetFindInput } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class EmailResetGetQuery implements IQuery {
    readonly input: IEmailResetFindInput;
    static readonly type = "[Email Reset] Get";
    constructor(input: IEmailResetFindInput);
}
