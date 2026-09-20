import { ICommand } from '@nestjs/cqrs';
import { IGetTimeLogConflictInput } from '@gauzy/contracts';
export declare class IGetConflictTimeLogCommand implements ICommand {
    readonly input: IGetTimeLogConflictInput;
    static readonly type = "[TimeLog] get conflict";
    constructor(input: IGetTimeLogConflictInput);
}
