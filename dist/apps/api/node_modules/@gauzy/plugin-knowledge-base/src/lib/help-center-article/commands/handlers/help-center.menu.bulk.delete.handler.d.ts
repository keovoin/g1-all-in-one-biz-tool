import { ICommandHandler } from '@nestjs/cqrs';
import { HelpCenterArticleService } from './../../../help-center-article/help-center-article.service';
import { KnowledgeBaseCategoryBulkDeleteCommand } from '../help-center.menu.bulk.delete.command';
export declare class KnowledgeBaseCategoryBulkDeleteHandler implements ICommandHandler<KnowledgeBaseCategoryBulkDeleteCommand> {
    private readonly helpCenterArticle;
    constructor(helpCenterArticle: HelpCenterArticleService);
    execute(command: KnowledgeBaseCategoryBulkDeleteCommand): Promise<void>;
}
