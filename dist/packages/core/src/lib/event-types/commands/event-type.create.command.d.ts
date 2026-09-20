import { ICommand } from '@nestjs/cqrs';
import { IEventTypeCreateInput } from '@gauzy/contracts';
export declare class EventTypeCreateCommand implements ICommand {
    readonly input: IEventTypeCreateInput;
    static readonly type = "[EventType] Create";
    constructor(input: IEventTypeCreateInput);
}
