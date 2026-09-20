import { IUpdateTimesheetProjectChangeStatus, TimesheetProjectChangeStatus } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../../core/dto';
/**
 * Payload an approver sends to approve or reject a pending project change request.
 *
 * `PENDING` is deliberately NOT accepted — a review always moves the request out of
 * the pending state.
 */
export declare class ReviewTimesheetProjectChangeDTO extends TenantOrganizationBaseDTO implements IUpdateTimesheetProjectChangeStatus {
    readonly status: TimesheetProjectChangeStatus.APPROVED | TimesheetProjectChangeStatus.REJECTED;
    readonly reviewNote?: string;
}
