import { ICommand } from '@nestjs/cqrs';
export declare class KnowledgeBaseCategoryBulkDeleteCommand implements ICommand {
    readonly id: string;
    static readonly type = "[KnowledgeBaseCategory] Delete";
    constructor(id: string);
}
