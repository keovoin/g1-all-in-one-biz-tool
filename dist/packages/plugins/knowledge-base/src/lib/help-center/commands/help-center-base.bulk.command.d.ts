import { ICommand } from '@nestjs/cqrs';
export declare class KnowledgeBaseBulkDeleteCommand implements ICommand {
    readonly id: string;
    static readonly type = "[KnowledgeBase] Delete";
    constructor(id: string);
}
