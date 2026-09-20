import { ICommandHandler } from '@nestjs/cqrs';
import { PluginService, PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { CreatePluginTenantCommand } from '../create-plugin-tenant.command';
export declare class CreatePluginTenantCommandHandler implements ICommandHandler<CreatePluginTenantCommand> {
    private readonly pluginTenantService;
    private readonly pluginService;
    constructor(pluginTenantService: PluginTenantService, pluginService: PluginService);
    /**
     * Executes the create plugin tenant command
     *
     * @param command - The command containing plugin tenant creation data
     * @returns The created plugin tenant
     * @throws BadRequestException if validation fails
     * @throws ConflictException if plugin tenant already exists
     */
    execute(command: CreatePluginTenantCommand): Promise<IPluginTenant>;
}
