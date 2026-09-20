import { IDashboardWidgetCreateInput, IDashboardWidgetUpdateInput, ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../../core/crud';
import { DashboardWidget } from './dashboard-widget.entity';
import { TypeOrmDashboardWidgetRepository } from './repository/type-orm-dashboard-widget.repository';
import { MikroOrmDashboardWidgetRepository } from './repository/mikro-orm-dashboard-widget.repository';
import { ActivityLogService } from '../../activity-log/activity-log.service';
export declare class DashboardWidgetService extends TenantAwareCrudService<DashboardWidget> {
    readonly typeOrmDashboardWidgetRepository: TypeOrmDashboardWidgetRepository;
    readonly mikroOrmDashboardWidgetRepository: MikroOrmDashboardWidgetRepository;
    private readonly activityLogService;
    constructor(typeOrmDashboardWidgetRepository: TypeOrmDashboardWidgetRepository, mikroOrmDashboardWidgetRepository: MikroOrmDashboardWidgetRepository, activityLogService: ActivityLogService);
    /**
     * Creates a new dashboard widget
     *
     * @param {IDashboardWidgetCreateInput} input - The input data for creating a dashboard widget
     * @returns {Promise<DashboardWidget>} The created dashboard widget
     */
    create(input: IDashboardWidgetCreateInput): Promise<DashboardWidget>;
    /**
     * Updates an existing dashboard widget
     *
     * @param {ID} id - The ID of the dashboard widget to update
     * @param {IDashboardWidgetUpdateInput} input - The input data for updating a dashboard widget
     * @returns {Promise<DashboardWidget>} The updated dashboard widget
     */
    update(id: ID, input: IDashboardWidgetUpdateInput): Promise<DashboardWidget>;
}
