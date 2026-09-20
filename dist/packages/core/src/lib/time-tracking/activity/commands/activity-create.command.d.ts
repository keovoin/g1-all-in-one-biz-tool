import { ICommand } from '@nestjs/cqrs';
import { IActivity } from '@gauzy/contracts';
export declare class ActivityCreateCommand implements ICommand {
    readonly input: IActivity;
    static readonly type = "[Activity] Create Activity";
    constructor(input: IActivity);
}
