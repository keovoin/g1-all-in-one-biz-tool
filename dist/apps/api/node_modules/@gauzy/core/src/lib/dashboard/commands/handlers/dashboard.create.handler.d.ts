import { ICommandHandler } from '@nestjs/cqrs';
import { IDashboard } from '@gauzy/contracts';
import { DashboardService } from '../../dashboard.service';
import { DashboardCreateCommand } from '../dashboard.create.command';
export declare class DashboardCreateHandler implements ICommandHandler<DashboardCreateCommand> {
    private readonly dashboardService;
    private readonly logger;
    constructor(dashboardService: DashboardService);
    /**
     * Handles the DashboardCreateCommand to create a new dashboard.
     *
     * @param command - The command containing the input data for dashboard creation.
     * @returns A promise that resolves to the created dashboard.
     */
    execute(command: DashboardCreateCommand): Promise<IDashboard>;
}
