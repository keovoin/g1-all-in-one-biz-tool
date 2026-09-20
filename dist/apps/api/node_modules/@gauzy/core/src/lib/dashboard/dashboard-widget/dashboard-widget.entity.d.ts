import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IDashboardWidget, JsonData, IDashboard, IOrganizationTeam, IEmployee, IOrganizationProject } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from './../../core/entities/internal';
import { MikroOrmDashboardWidgetRepository } from './repository/mikro-orm-dashboard-widget.repository';
export declare class DashboardWidget extends TenantOrganizationBaseEntity implements IDashboardWidget {
    [EntityRepositoryType]?: MikroOrmDashboardWidgetRepository;
    name: string;
    order?: number;
    size?: number;
    color?: string;
    isVisible?: boolean;
    options?: JsonData;
    /**
     * Dashboard widget dashboard
     */
    dashboard?: IDashboard;
    dashboardId?: ID;
    /**
     * Dashboard widget employee
     */
    employee?: IEmployee;
    employeeId?: ID;
    /**
     * Dashboard widget project
     */
    project?: IOrganizationProject;
    projectId?: ID;
    /**
     * Dashboard widget team
     */
    organizationTeam?: IOrganizationTeam;
    organizationTeamId?: ID;
}
