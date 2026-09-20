import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { UpdatePluginTenantCommand } from '../update-plugin-tenant.command';
export declare class UpdatePluginTenantCommandHandler implements ICommandHandler<UpdatePluginTenantCommand> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the update plugin tenant command
     *
     * @param command - The command containing plugin tenant update data
     * @returns The updated plugin tenant
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if plugin tenant not found
     */
    execute(command: UpdatePluginTenantCommand): Promise<IPluginTenant>;
}
