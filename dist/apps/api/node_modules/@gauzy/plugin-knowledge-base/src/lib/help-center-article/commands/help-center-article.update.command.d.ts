import { ICommand } from '@nestjs/cqrs';
import { IHelpCenterArticleUpdate } from '@gauzy/contracts';
export declare class HelpCenterUpdateArticleCommand implements ICommand {
    id: string;
    readonly input: IHelpCenterArticleUpdate;
    static readonly type = "[Article] Update";
    constructor(id: string, input: IHelpCenterArticleUpdate);
}
