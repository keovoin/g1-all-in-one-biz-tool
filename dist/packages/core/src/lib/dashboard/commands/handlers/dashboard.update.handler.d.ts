import { ICommandHandler } from '@nestjs/cqrs';
import { IDashboard } from '@gauzy/contracts';
import { DashboardService } from '../../dashboard.service';
import { DashboardUpdateCommand } from '../dashboard.update.command';
export declare class DashboardUpdateHandler implements ICommandHandler<DashboardUpdateCommand> {
    private readonly dashboardService;
    private readonly logger;
    constructor(dashboardService: DashboardService);
    /**
     * Handles the DashboardUpdateCommand to update an existing dashboard.
     *
     * @param command - The command containing the id and input data for dashboard update.
     * @returns A promise that resolves to the updated dashboard.
     */
    execute(command: DashboardUpdateCommand): Promise<IDashboard>;
}
