import { ICommand } from '@nestjs/cqrs';
import { TimeOffRequest } from '../time-off-request.entity';
export declare class TimeOffCreateCommand implements ICommand {
    readonly input: TimeOffRequest;
    static readonly type = "[TimeOff] Create";
    constructor(input: TimeOffRequest);
}
