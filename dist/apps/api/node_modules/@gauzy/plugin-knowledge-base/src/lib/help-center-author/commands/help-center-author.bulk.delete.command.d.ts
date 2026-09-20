import { ICommand } from '@nestjs/cqrs';
export declare class KnowledgeBaseArticleBulkDeleteCommand implements ICommand {
    readonly id: string;
    static readonly type = "[KnowledgeBaseArticle] Delete";
    constructor(id: string);
}
