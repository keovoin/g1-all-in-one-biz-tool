import { ICommand } from '@nestjs/cqrs';
export declare class KeyResultBulkCreateCommand implements ICommand {
    readonly input: any[];
    static readonly type = "[KeyResult] Register";
    constructor(input: any[]);
}
