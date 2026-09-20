import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { TimeOffRequest } from '../time-off-request.entity';
export declare class TimeOffUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: TimeOffRequest;
    static readonly type = "[TimeOff] update";
    constructor(id: ID, input: TimeOffRequest);
}
