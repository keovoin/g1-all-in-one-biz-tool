import { IHelpCenterAuthor } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { ArticleAuthorsBulkCreateCommand } from '..';
import { HelpCenterAuthorService } from '../../help-center-author.service';
export declare class ArticleAuthorsBulkCreateHandler implements ICommandHandler<ArticleAuthorsBulkCreateCommand> {
    private readonly helpCenterAuthorService;
    constructor(helpCenterAuthorService: HelpCenterAuthorService);
    execute(command: ArticleAuthorsBulkCreateCommand): Promise<IHelpCenterAuthor[]>;
}
