import { ID, IOrganizationProject, ITimesheet, ITimesheetProjectChangeRequest, IUser, TimesheetProjectChangeStatus } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from './../../core/entities/internal';
/**
 * A request, raised by the owner of a timesheet, to move the time logged against one
 * project over to another project (issue #9516).
 *
 * A timesheet is a per-employee, per-period container of `TimeLog` rows and the project
 * lives on the *log*, not on the timesheet — one timesheet routinely holds logs for
 * several projects. Every request therefore records BOTH endpoints of the move:
 * `previousProjectId` (where the time is booked now) and `requestedProjectId` (where it
 * should go). Approving a request only ever touches logs currently on
 * `previousProjectId`, so correctly-booked time in the same timesheet is left alone.
 */
export declare class TimesheetProjectChangeRequest extends TenantOrganizationBaseEntity implements ITimesheetProjectChangeRequest {
    /** Why the employee is asking for the change. Mandatory, per issue #9516. */
    reason: string;
    status: TimesheetProjectChangeStatus;
    reviewedAt?: Date;
    reviewNote?: string;
    /**
     * Timesheet the request was raised against.
     */
    timesheet?: ITimesheet;
    timesheetId: ID;
    /**
     * Project the affected time logs should be moved TO.
     */
    requestedProject?: IOrganizationProject;
    requestedProjectId: ID;
    /**
     * Project the affected time logs are booked to at the time the request is raised.
     */
    previousProject?: IOrganizationProject;
    previousProjectId: ID;
    /**
     * User who approved or rejected the request.
     */
    reviewedBy?: IUser;
    reviewedById?: ID;
}
