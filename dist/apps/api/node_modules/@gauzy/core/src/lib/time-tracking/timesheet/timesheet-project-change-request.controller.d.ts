import { ID, ITimesheetProjectChangeRequest } from '@gauzy/contracts';
import { RequestTimesheetProjectChangeDTO, ReviewTimesheetProjectChangeDTO } from './dto';
import { TimesheetProjectChangeRequestService } from './timesheet-project-change-request.service';
/**
 * Endpoints for the timesheet project change workflow (issue #9516).
 *
 * Raising a request needs nothing more than the time tracker permission every employee already
 * has — it changes no data on its own. Approving or rejecting one needs `CAN_APPROVE_TIMESHEET`,
 * the same permission that already gates approving a timesheet.
 */
export declare class TimesheetProjectChangeRequestController {
    private readonly timesheetProjectChangeRequestService;
    constructor(timesheetProjectChangeRequestService: TimesheetProjectChangeRequestService);
    /**
     * Employee asks for the time booked to one project in their timesheet to be moved to another.
     *
     * @param input the request payload
     * @returns the created request, in `PENDING` state
     */
    requestProjectChange(input: RequestTimesheetProjectChangeDTO): Promise<ITimesheetProjectChangeRequest>;
    /**
     * Approve or reject a pending project change request.
     *
     * @param id the request to review
     * @param input the new status and an optional review note
     * @returns the reviewed request
     */
    review(id: ID, input: ReviewTimesheetProjectChangeDTO): Promise<ITimesheetProjectChangeRequest>;
    /**
     * List the project change requests raised against a timesheet.
     *
     * @param timesheetId the timesheet to list requests for
     * @param organizationId the organization the timesheet belongs to
     * @returns the matching requests, newest first
     */
    findAllByTimesheet(timesheetId: ID, organizationId: ID): Promise<ITimesheetProjectChangeRequest[]>;
}
