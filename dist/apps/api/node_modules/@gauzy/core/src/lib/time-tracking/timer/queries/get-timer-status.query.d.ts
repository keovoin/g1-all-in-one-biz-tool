import { IQuery } from '@nestjs/cqrs';
import { ITimerStatusInput } from '@gauzy/contracts';
export declare class GetTimerStatusQuery implements IQuery {
    readonly input: ITimerStatusInput;
    constructor(input: ITimerStatusInput);
}
