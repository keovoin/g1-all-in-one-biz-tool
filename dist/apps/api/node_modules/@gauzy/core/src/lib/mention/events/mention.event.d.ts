import { IEvent } from '@nestjs/cqrs';
import { IMentionCreateInput } from '@gauzy/contracts';
export declare class CreateMentionEvent implements IEvent {
    readonly input: IMentionCreateInput;
    constructor(input: IMentionCreateInput);
}
