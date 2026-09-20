import { IHelpCenterAuthorCreate } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ArticleAuthorsBulkCreateCommand implements ICommand {
    readonly input: IHelpCenterAuthorCreate;
    static readonly type = "[ArticleAuthors] Add";
    constructor(input: IHelpCenterAuthorCreate);
}
