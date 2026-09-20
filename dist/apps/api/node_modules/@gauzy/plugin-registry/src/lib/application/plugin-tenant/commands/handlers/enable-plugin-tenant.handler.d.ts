import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { EnablePluginTenantCommand } from '../enable-plugin-tenant.command';
export declare class EnablePluginTenantCommandHandler implements ICommandHandler<EnablePluginTenantCommand> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the enable plugin tenant command
     *
     * @param command - The command containing plugin tenant ID to enable
     * @returns The updated plugin tenant
     * @throws NotFoundException if plugin tenant not found
     */
    execute(command: EnablePluginTenantCommand): Promise<IPluginTenant>;
}
