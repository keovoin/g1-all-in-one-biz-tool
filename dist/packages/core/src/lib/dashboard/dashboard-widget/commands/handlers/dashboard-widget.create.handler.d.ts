import { ICommandHandler } from '@nestjs/cqrs';
import { IDashboardWidget } from '@gauzy/contracts';
import { DashboardWidgetService } from '../../dashboard-widget.service';
import { DashboardWidgetCreateCommand } from '../dashboard-widget.create.command';
export declare class DashboardWidgetCreateHandler implements ICommandHandler<DashboardWidgetCreateCommand> {
    private readonly dashboardWidgetService;
    constructor(dashboardWidgetService: DashboardWidgetService);
    /**
     * Handles the DashboardWidgetCreateCommand to create a new dashboard widget.
     *
     * @param command - The command containing the input data for dashboard widget creation.
     * @returns A promise that resolves to the created dashboard widget.
     */
    execute(command: DashboardWidgetCreateCommand): Promise<IDashboardWidget>;
}
