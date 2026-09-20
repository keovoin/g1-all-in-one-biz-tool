import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { UpdatePluginTenantConfigurationCommand } from '../update-plugin-tenant-configuration.command';
export declare class UpdatePluginTenantConfigurationCommandHandler implements ICommandHandler<UpdatePluginTenantConfigurationCommand> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the update plugin tenant configuration command
     *
     * @param command - The command containing configuration update data
     * @returns The updated plugin tenant
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if plugin tenant not found
     */
    execute(command: UpdatePluginTenantConfigurationCommand): Promise<IPluginTenant>;
}
