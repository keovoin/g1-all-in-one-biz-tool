import { IEventHandler } from '@nestjs/cqrs';
import { EmployeeRecentVisitEvent } from '../employee-recent-visit.event';
import { EmployeeRecentVisitService } from '../../employee-recent-visit.service';
export declare class EmployeeRecentVisitEventHandler implements IEventHandler<EmployeeRecentVisitEvent> {
    readonly employeeRecentVisitService: EmployeeRecentVisitService;
    constructor(employeeRecentVisitService: EmployeeRecentVisitService);
    /**
     * Handles the employee recent visit event by creating a new employee recent visit entry using the provided input data.
     *
     * @param event - The employee recent visit event containing the input data required to create the visit entry.
     * @returns A promise that resolves with the created employee recent visit entry.
     *
     */
    handle(event: EmployeeRecentVisitEvent): Promise<import("dist/packages/contracts/src").IEmployeeRecentVisit>;
}
