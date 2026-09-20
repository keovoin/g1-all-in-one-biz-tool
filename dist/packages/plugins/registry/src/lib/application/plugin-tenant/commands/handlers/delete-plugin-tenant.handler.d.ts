import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { DeletePluginTenantCommand } from '../delete-plugin-tenant.command';
export declare class DeletePluginTenantCommandHandler implements ICommandHandler<DeletePluginTenantCommand> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the delete plugin tenant command
     *
     * @param command - The command containing plugin tenant ID to delete
     * @returns Promise<void>
     * @throws NotFoundException if plugin tenant not found
     */
    execute(command: DeletePluginTenantCommand): Promise<void>;
}
