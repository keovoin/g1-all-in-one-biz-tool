import { ID, IEmployee, IOrganizationSprintEmployee, IRole } from '@gauzy/contracts';
import { OrganizationSprint, TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationSprintEmployee extends TenantOrganizationBaseEntity implements IOrganizationSprintEmployee {
    isManager?: boolean;
    assignedAt?: Date;
    /**
     * OrganizationSprint
     */
    organizationSprint: OrganizationSprint;
    organizationSprintId: ID;
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
