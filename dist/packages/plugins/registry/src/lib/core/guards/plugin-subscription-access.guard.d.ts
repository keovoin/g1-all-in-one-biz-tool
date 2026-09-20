import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PluginSubscriptionAccessService } from '../../domain/services/plugin-subscription-access.service';
/**
 * Guard to validate plugin subscription access before allowing operations.
 * This guard checks if the user has an active subscription to access the plugin.
 *
 * Usage:
 * @UseGuards(PluginSubscriptionAccessGuard)
 * @SetMetadata('pluginIdParam', 'pluginId') // Optional: specify which param contains the plugin ID
 *
 * By default, it looks for 'pluginId' in route params.
 */
export declare class PluginSubscriptionAccessGuard implements CanActivate {
    private readonly reflector;
    private readonly subscriptionAccessService;
    constructor(reflector: Reflector, subscriptionAccessService: PluginSubscriptionAccessService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
