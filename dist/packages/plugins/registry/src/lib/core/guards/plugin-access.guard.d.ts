import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PluginInstallationService } from '../../domain/services/plugin-installation.service';
import { PluginSubscriptionAccessService } from '../../domain/services/plugin-subscription-access.service';
import { PluginService } from '../../domain/services/plugin.service';
export declare class PluginAccessGuard implements CanActivate {
    private readonly pluginService;
    private readonly pluginSubscriptionAccessService;
    private readonly pluginInstallationService;
    constructor(pluginService: PluginService, pluginSubscriptionAccessService: PluginSubscriptionAccessService, pluginInstallationService: PluginInstallationService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getPluginIdFromRequest;
}
