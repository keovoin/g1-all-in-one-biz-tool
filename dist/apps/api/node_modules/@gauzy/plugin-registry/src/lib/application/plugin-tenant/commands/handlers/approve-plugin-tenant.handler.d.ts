import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { ApprovePluginTenantCommand } from '../approve-plugin-tenant.command';
export declare class ApprovePluginTenantCommandHandler implements ICommandHandler<ApprovePluginTenantCommand> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the approve plugin tenant command
     *
     * @param command - The command containing approval data
     * @returns The updated plugin tenant
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if plugin tenant not found
     */
    execute(command: ApprovePluginTenantCommand): Promise<IPluginTenant>;
}
