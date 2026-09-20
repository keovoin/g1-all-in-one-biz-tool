import { ID, IRequestTimesheetProjectChange, ITimesheetProjectChangeRequest, IUpdateTimesheetProjectChangeStatus } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../../core/crud';
import { TypeOrmOrganizationProjectRepository } from './../../organization-project/repository/type-orm-organization-project.repository';
import { TypeOrmTimeLogRepository } from './../time-log/repository/type-orm-time-log.repository';
import { TimesheetProjectChangeRequest } from './timesheet-project-change-request.entity';
import { MikroOrmTimesheetProjectChangeRequestRepository } from './repository/mikro-orm-timesheet-project-change-request.repository';
import { TypeOrmTimesheetProjectChangeRequestRepository } from './repository/type-orm-timesheet-project-change-request.repository';
import { TypeOrmTimesheetRepository } from './repository/type-orm-timesheet.repository';
/**
 * Handles the "switch a timesheet's project after creation" workflow from issue #9516.
 *
 * An employee raises a request against one of their own timesheets naming the project the
 * time is currently booked to, the project it should move to, and a reason. Somebody holding
 * `CAN_APPROVE_TIMESHEET` then approves or rejects it. Only an approval moves data, and it
 * only ever moves logs that sit on `previousProjectId` — the project lives on `TimeLog`, not
 * on `Timesheet`, and one timesheet routinely holds logs for several projects, so a blanket
 * reassignment would destroy correctly-booked time.
 */
export declare class TimesheetProjectChangeRequestService extends TenantAwareCrudService<TimesheetProjectChangeRequest> {
    readonly typeOrmTimesheetProjectChangeRequestRepository: TypeOrmTimesheetProjectChangeRequestRepository;
    readonly mikroOrmTimesheetProjectChangeRequestRepository: MikroOrmTimesheetProjectChangeRequestRepository;
    private readonly typeOrmTimesheetRepository;
    private readonly typeOrmTimeLogRepository;
    private readonly typeOrmOrganizationProjectRepository;
    constructor(typeOrmTimesheetProjectChangeRequestRepository: TypeOrmTimesheetProjectChangeRequestRepository, mikroOrmTimesheetProjectChangeRequestRepository: MikroOrmTimesheetProjectChangeRequestRepository, typeOrmTimesheetRepository: TypeOrmTimesheetRepository, typeOrmTimeLogRepository: TypeOrmTimeLogRepository, typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository);
    /**
     * Raise a project change request against one of the current employee's own timesheets.
     *
     * @param input timesheet, source project, target project and the mandatory reason
     * @returns the created request, in `PENDING` state
     */
    requestProjectChange(input: IRequestTimesheetProjectChange): Promise<ITimesheetProjectChangeRequest>;
    /**
     * Approve or reject a pending request. Approving moves every live time log of the timesheet
     * that currently sits on `previousProjectId` over to `requestedProjectId`, atomically.
     *
     * @param id the request to review
     * @param input the new status and an optional review note
     * @returns the reviewed request
     */
    review(id: ID, input: IUpdateTimesheetProjectChangeStatus): Promise<ITimesheetProjectChangeRequest>;
    /**
     * List the requests raised against a timesheet, newest first.
     *
     * Employees only ever see requests on their own timesheets; holders of
     * `CAN_APPROVE_TIMESHEET` see every request in the organization.
     *
     * @param timesheetId the timesheet to list requests for
     * @param organizationId the organization the timesheet belongs to
     * @returns the matching requests
     */
    findAllByTimesheet(timesheetId: ID, organizationId: ID): Promise<ITimesheetProjectChangeRequest[]>;
    /**
     * Move the affected time logs onto the requested project.
     *
     * Only logs of THIS timesheet that are still booked to `previousProjectId` are touched, so
     * time logged against other projects in the same timesheet is never disturbed. A moved log
     * whose task does not belong to the target project is detached from that task, because a
     * task cannot be carried across a project boundary.
     *
     * @param manager the transactional entity manager
     * @param request the approved request
     */
    private reassignTimeLogs;
}
