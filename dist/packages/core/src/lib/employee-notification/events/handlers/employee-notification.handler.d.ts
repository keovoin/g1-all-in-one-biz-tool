import { IEventHandler } from '@nestjs/cqrs';
import { EmployeeCreateNotificationEvent } from '../employee-notification.event';
import { EmployeeNotificationService } from '../../employee-notification.service';
export declare class EmployeeCreateNotificationEventHandler implements IEventHandler<EmployeeCreateNotificationEvent> {
    readonly employeeNotificationService: EmployeeNotificationService;
    private readonly logger;
    constructor(employeeNotificationService: EmployeeNotificationService);
    /**
     * Handles the employee notification event by creating a new employee notification entry using the provided input data.
     *
     * @param event - The employee notification event containing the input data required to create the notification entry.
     * @returns A promise that resolves with the created employee notification entry.
     *
     */
    handle(event: EmployeeCreateNotificationEvent): Promise<import("dist/packages/contracts/src").IEmployeeNotification>;
}
