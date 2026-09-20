import { IEvent } from '@nestjs/cqrs';
import { IEmployeeRecentVisitInput } from '@gauzy/contracts';
export declare class EmployeeRecentVisitEvent implements IEvent {
    readonly input: IEmployeeRecentVisitInput;
    constructor(input: IEmployeeRecentVisitInput);
}
