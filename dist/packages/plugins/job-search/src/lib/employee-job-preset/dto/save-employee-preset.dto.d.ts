import { ID, IEmployeePresetInput, JobPostSourceEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * POST /job-preset/employee body.
 *
 * `employeeId`, when sent, MUST be a real UUID: the handler deletes the employee's existing search
 * criteria by `{ employeeId }`, and a null value used to be dropped from the SQL, turning that into an
 * unfiltered DELETE across every tenant (GHSA-44pv-34gx-q9p4 class). Callers without
 * CHANGE_SELECTED_EMPLOYEE may omit it — the handler pins their own employee and fails closed when
 * there is none.
 */
export declare class SaveEmployeePresetDTO extends TenantOrganizationBaseDTO implements IEmployeePresetInput {
    readonly employeeId?: ID;
    readonly jobPresetIds: ID[];
    readonly source?: JobPostSourceEnum;
}
