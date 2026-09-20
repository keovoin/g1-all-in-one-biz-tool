import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService, PluginTenantService } from '../../../../domain';
import { DeletePluginSubscriptionCommand } from '../delete-plugin-subscription.command';
export declare class DeletePluginSubscriptionCommandHandler implements ICommandHandler<DeletePluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    private readonly pluginTenantService;
    constructor(pluginSubscriptionService: PluginSubscriptionService, pluginTenantService: PluginTenantService);
    execute(command: DeletePluginSubscriptionCommand): Promise<void>;
}
