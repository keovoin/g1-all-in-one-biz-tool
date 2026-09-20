import { ICommand } from '@nestjs/cqrs';
import { IHelpCenter } from '@gauzy/contracts';
export declare class HelpCenterUpdateCommand implements ICommand {
    readonly oldChildren: IHelpCenter[];
    readonly newChildren: IHelpCenter[];
    static readonly type = "[HelpCenter] Update";
    constructor(oldChildren: IHelpCenter[], newChildren: IHelpCenter[]);
}
