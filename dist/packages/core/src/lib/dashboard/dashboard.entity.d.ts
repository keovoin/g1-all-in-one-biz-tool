import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IDashboard, IEmployee, JsonData } from '@gauzy/contracts';
import { DashboardWidget, TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmDashboardRepository } from './repository/mikro-orm-dashboard.repository';
export declare class Dashboard extends TenantOrganizationBaseEntity implements IDashboard {
    [EntityRepositoryType]?: MikroOrmDashboardRepository;
    /**
     * Name of the dashboard
     */
    name: string;
    /**
     * Identifier of the dashboard
     */
    identifier: string;
    /**
     * Description of the dashboard
     */
    description?: string;
    /**
     * Content of the dashboard (serialized widget layout).
     *
     * Note: intentionally has no strict type validator — `JsonData` may be an
     * object (postgres/mysql json columns) or a string (sqlite text column),
     * mirroring `DashboardWidget.options`.
     */
    contentHtml?: JsonData;
    /**
     * Indicates if the dashboard is the default dashboard
     */
    isDefault?: boolean;
    /**
     * The employee for whom the dashboard is created
     */
    employee?: IEmployee;
    /**
     * The employee ID for whom the dashboard is created
     */
    employeeId?: ID;
    /**
     * Dashboard Widgets
     */
    widgets?: DashboardWidget[];
}
