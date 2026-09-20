import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IManagerAssignable } from './common.model';
import { IRelationalOrganizationTeam } from './organization-team.model';
import { IEmployeeEntityInput } from './employee.model';
import { IRelationalRole } from './role.model';
import { ITimerStatus } from './timesheet.model';
import { ITask } from './task.model';
export interface IBaseOrganizationTeamEmployee extends IBasePerTenantAndOrganizationEntityModel, IRelationalOrganizationTeam, IManagerAssignable {
    order?: number;
    isTrackingEnabled?: boolean;
}
export interface IOrganizationTeamEmployee extends IBaseOrganizationTeamEmployee, IEmployeeEntityInput, IRelationalRole, ITimerStatus {
    activeTaskId?: ID;
    activeTask?: ITask;
}
export interface IOrganizationTeamEmployeeFindInput extends IBasePerTenantAndOrganizationEntityModel, IRelationalOrganizationTeam, Pick<IBaseOrganizationTeamEmployee, 'isManager' | 'isTrackingEnabled'> {
}
export interface IOrganizationTeamEmployeeUpdateInput extends IBaseOrganizationTeamEmployee {
}
export interface IOrganizationTeamEmployeeActiveTaskUpdateInput extends IBasePerTenantAndOrganizationEntityModel, IRelationalOrganizationTeam {
    activeTaskId?: ID;
}
