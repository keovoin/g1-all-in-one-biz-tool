import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PluginSubscriptionAccessService } from '../../domain/services/plugin-subscription-access.service';
/**
 * Guard to validate that the user has a valid subscription before installing a plugin
 */
export declare class PluginSubscriptionGuard implements CanActivate {
    private readonly pluginSubscriptionAccessService;
    constructor(pluginSubscriptionAccessService: PluginSubscriptionAccessService);
    /**
     * Validates that the user has a valid subscription for the plugin
     * @param context The execution context
     * @returns Promise<boolean> indicating if the user has valid subscription
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
}
