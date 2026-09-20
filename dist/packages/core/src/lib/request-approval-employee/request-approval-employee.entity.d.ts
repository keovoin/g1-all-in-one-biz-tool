import { IEmployee, IRequestApproval, IRequestApprovalEmployee } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class RequestApprovalEmployee extends TenantOrganizationBaseEntity implements IRequestApprovalEmployee {
    status: number;
    requestApproval: IRequestApproval;
    requestApprovalId: string;
    employee: IEmployee;
    employeeId: string;
}
