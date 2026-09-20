import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { DisablePluginTenantCommand } from '../disable-plugin-tenant.command';
export declare class DisablePluginTenantCommandHandler implements ICommandHandler<DisablePluginTenantCommand> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the disable plugin tenant command
     *
     * @param command - The command containing plugin tenant ID to disable
     * @returns The updated plugin tenant
     * @throws NotFoundException if plugin tenant not found
     */
    execute(command: DisablePluginTenantCommand): Promise<IPluginTenant>;
}
