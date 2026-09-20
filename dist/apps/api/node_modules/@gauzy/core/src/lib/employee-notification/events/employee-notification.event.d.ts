import { IEvent } from '@nestjs/cqrs';
import { IEmployeeNotificationCreateInput } from '@gauzy/contracts';
export declare class EmployeeCreateNotificationEvent implements IEvent {
    readonly input: IEmployeeNotificationCreateInput;
    constructor(input: IEmployeeNotificationCreateInput);
}
