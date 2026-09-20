import { ICommandHandler } from '@nestjs/cqrs';
import { KnowledgeBaseArticleBulkDeleteCommand } from '..';
import { HelpCenterAuthorService } from '../../help-center-author.service';
export declare class KnowledgeBaseArticleBulkDeleteHandler implements ICommandHandler<KnowledgeBaseArticleBulkDeleteCommand> {
    private readonly helpCenterAuthorService;
    constructor(helpCenterAuthorService: HelpCenterAuthorService);
    execute(command: KnowledgeBaseArticleBulkDeleteCommand): Promise<any>;
}
