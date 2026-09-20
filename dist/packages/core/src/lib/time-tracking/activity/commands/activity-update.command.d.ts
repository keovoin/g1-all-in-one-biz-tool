import { ICommand } from '@nestjs/cqrs';
import { IActivity } from '@gauzy/contracts';
export declare class ActivityUpdateCommand implements ICommand {
    readonly input: IActivity;
    static readonly type = "[Activity] Update";
    constructor(input: IActivity);
}
