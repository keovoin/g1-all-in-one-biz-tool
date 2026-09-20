import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { BulkUpdatePluginTenantCommand } from '../bulk-update-plugin-tenant.command';
export declare class BulkUpdatePluginTenantCommandHandler implements ICommandHandler<BulkUpdatePluginTenantCommand> {
    private readonly pluginTenantService;
    private readonly logger;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the bulk update plugin tenant command
     *
     * @param command - The command containing bulk operation data
     * @returns Array of operation results
     * @throws BadRequestException if validation fails
     */
    execute(command: BulkUpdatePluginTenantCommand): Promise<{
        success: IPluginTenant[];
        failed: Array<{
            id: string;
            error: string;
        }>;
    }>;
}
