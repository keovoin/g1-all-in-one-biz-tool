import { ID, IEmployee, IOrganizationProject, IOrganizationProjectEmployee, IRole } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationProjectEmployee extends TenantOrganizationBaseEntity implements IOrganizationProjectEmployee {
    isManager?: boolean;
    assignedAt?: Date;
    /**
     * OrganizationProject
     */
    organizationProject: IOrganizationProject;
    organizationProjectId: ID;
    /**
     * Employee
     */
    employee: IEmployee;
    employeeId?: ID;
    /**
     * Role
     */
    role: IRole;
    roleId?: ID;
}
