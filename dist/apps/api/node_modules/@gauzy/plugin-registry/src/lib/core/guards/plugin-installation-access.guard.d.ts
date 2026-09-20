import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PluginInstallationService } from '../../domain/services/plugin-installation.service';
import { PluginSubscriptionAccessService } from '../../domain/services/plugin-subscription-access.service';
import { PluginService } from '../../domain/services/plugin.service';
export declare class PluginInstallationAccessGuard implements CanActivate {
    private readonly pluginInstallationService;
    private readonly pluginService;
    private readonly pluginSubscriptionAccessService;
    constructor(pluginInstallationService: PluginInstallationService, pluginService: PluginService, pluginSubscriptionAccessService: PluginSubscriptionAccessService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getInstallationIdFromRequest;
}
