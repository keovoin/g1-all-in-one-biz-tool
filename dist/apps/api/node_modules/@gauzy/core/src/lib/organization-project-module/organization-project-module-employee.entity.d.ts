import { ID, IEmployee, IOrganizationProjectModuleEmployee, IRole } from '@gauzy/contracts';
import { OrganizationProjectModule, TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationProjectModuleEmployee extends TenantOrganizationBaseEntity implements IOrganizationProjectModuleEmployee {
    isManager?: boolean;
    assignedAt?: Date;
    /**
     * OrganizationProjectModule
     */
    organizationProjectModule: OrganizationProjectModule;
    organizationProjectModuleId: ID;
    /**
     * Employee
     */
    employee: IEmployee;
    employeeId: ID;
    /**
     * Role
     */
    role?: IRole;
    roleId?: ID;
}
