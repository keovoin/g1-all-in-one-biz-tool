import { ICommandHandler } from '@nestjs/cqrs';
import { HelpCenterUpdateArticleCommand } from '../help-center-article.update.command';
import { HelpCenterArticleService } from './../../help-center-article.service';
export declare class HelpCenterArticleUpdateHandler implements ICommandHandler<HelpCenterUpdateArticleCommand> {
    private readonly helpCenterArticle;
    constructor(helpCenterArticle: HelpCenterArticleService);
    execute(command: HelpCenterUpdateArticleCommand): Promise<void>;
}
