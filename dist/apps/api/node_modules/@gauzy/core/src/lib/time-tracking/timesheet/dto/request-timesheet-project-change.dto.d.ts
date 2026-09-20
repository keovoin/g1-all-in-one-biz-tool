import { ID, IRequestTimesheetProjectChange } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../../core/dto';
/**
 * Payload an employee sends to ask for the time logged against `previousProjectId`
 * in `timesheetId` to be moved to `requestedProjectId`.
 */
export declare class RequestTimesheetProjectChangeDTO extends TenantOrganizationBaseDTO implements IRequestTimesheetProjectChange {
    readonly timesheetId: ID;
    readonly requestedProjectId: ID;
    readonly previousProjectId: ID;
    readonly reason: string;
}
