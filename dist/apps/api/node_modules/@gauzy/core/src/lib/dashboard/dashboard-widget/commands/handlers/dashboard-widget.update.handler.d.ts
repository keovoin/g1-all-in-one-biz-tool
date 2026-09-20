import { ICommandHandler } from '@nestjs/cqrs';
import { IDashboardWidget } from '@gauzy/contracts';
import { DashboardWidgetService } from '../../dashboard-widget.service';
import { DashboardWidgetUpdateCommand } from '../dashboard-widget.update.command';
export declare class DashboardWidgetUpdateHandler implements ICommandHandler<DashboardWidgetUpdateCommand> {
    private readonly dashboardWidgetService;
    constructor(dashboardWidgetService: DashboardWidgetService);
    /**
     * Handles the DashboardWidgetUpdateCommand to update an existing dashboard widget.
     *
     * @param command - The command containing the id and input data for dashboard widget update.
     * @returns A promise that resolves to the updated dashboard widget.
     */
    execute(command: DashboardWidgetUpdateCommand): Promise<IDashboardWidget>;
}
