import { ID, ISubmitTimesheetInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../../core/dto';
/**
 * Submit timesheets status request DTO validation
 */
export declare class SubmitTimesheetStatusDTO extends TenantOrganizationBaseDTO implements ISubmitTimesheetInput {
    readonly ids: ID[];
    readonly status: 'submit' | 'unsubmit';
}
