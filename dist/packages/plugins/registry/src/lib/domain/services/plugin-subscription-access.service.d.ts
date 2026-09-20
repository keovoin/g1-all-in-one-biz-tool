import { ID, IPluginAccess, PluginScope, PluginSubscriptionStatus, PluginSubscriptionType } from '@gauzy/contracts';
import { IPluginSubscription } from '../../shared/models/plugin-subscription.model';
import { IPluginTenant } from '../../shared/models/plugin-tenant.model';
import { PluginSubscriptionPlanService } from './plugin-subscription-plan.service';
import { PluginSubscriptionService } from './plugin-subscription.service';
import { PluginTenantService } from './plugin-tenant.service';
/**
 * Quota information interface
 */
interface IQuotaInformation {
    installationUsage: number;
    installationLimit: number | null;
    userUsage: number;
    userLimit: number | null;
    quotaExceeded: boolean;
    installationUtilization: number;
    userUtilization: number;
}
/**
 * Domain service for plugin access management following SOLID principles
 *
 * SOLID Compliance:
 * - SRP: Single responsibility for plugin access validation
 * - OCP: Open for extension via strategies and specifications
 * - ISP: Interfaces are focused and specific to their purpose
 * - DIP: Depends on abstractions (interfaces) not concretions
 */
export declare class PluginSubscriptionAccessService {
    private readonly pluginSubscriptionService;
    private readonly pluginSubscriptionPlanService;
    private readonly pluginTenantService;
    private readonly accessContextFactory;
    constructor(pluginSubscriptionService: PluginSubscriptionService, pluginSubscriptionPlanService: PluginSubscriptionPlanService, pluginTenantService: PluginTenantService);
    /**
     * Find subscription by context parameters
     * Simplified finder that queries the subscription service directly without scope filtering
     */
    private findSubscriptionByContext;
    /**
     * Validate if a user has access to a plugin based on their subscription
     * This checks for subscriptions assigned to this specific user
     * Note: For full access validation including org/tenant subscriptions, use validatePluginAccess()
     */
    validatePluginUserAccess(pluginId: ID, tenantId: ID, userId?: ID): Promise<boolean>;
    /**
     * Validate if a user has access to a plugin based on their subscriptions
     * Uses entity domain logic and specifications pattern
     */
    validatePluginAccess(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<boolean>;
    /**
     * Validate if a user can access a plugin, throwing an exception if not
     * Enhanced error messaging using domain logic
     */
    requirePluginAccess(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<void>;
    /**
     * Find the applicable subscription for a user
     * Searches for a subscription matching the provided context parameters
     */
    findApplicableSubscription(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<IPluginSubscription | null>;
    /**
     * Check if a user can assign plugin subscriptions to other users
     * Enhanced with entity domain logic
     */
    canAssignSubscriptions(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<boolean>;
    /**
     * Validate if a user can assign plugin subscriptions, throwing an exception if not
     * Enhanced error messaging
     */
    requireAssignmentPermission(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<void>;
    /**
     * Determine the appropriate subscription scope based on subscription type and plan
     * Enhanced with domain logic
     */
    determineSubscriptionScope(subscriptionType: PluginSubscriptionType, requestedScope: PluginScope): PluginScope;
    /**
     * Determine the initial subscription status based on subscription type
     * Enhanced with business rules
     */
    determineInitialStatus(subscriptionType: PluginSubscriptionType): PluginSubscriptionStatus;
    /**
     * Check if plugin requires a subscription (has paid plans)
     * Delegates to plan service following DIP
     */
    requiresSubscription(pluginId: ID): Promise<boolean>;
    /**
     * Get subscription details for a plugin and user
     * Enhanced with comprehensive domain information
     */
    getSubscriptionDetails(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<Omit<IPluginAccess, 'subscription' | 'accessLevel'> & {
        subscription: IPluginSubscription | null;
        accessLevel: PluginScope | null;
    }>;
    /**
     * Get comprehensive plugin access status including PluginTenant controls
     * Enhanced with rich domain information
     */
    getPluginAccessStatus(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<{
        hasAccess: boolean;
        subscription: IPluginSubscription | null;
        pluginTenant: IPluginTenant | null;
        accessLevel: PluginScope | null;
        canAssign: boolean;
        canActivate: boolean;
        canManage: boolean;
        requiresSubscription: boolean;
        denialReasons: string[];
        quotaInfo?: IQuotaInformation;
    }>;
    /**
     * Check if user can install the plugin (considering quotas and permissions)
     * Enhanced with entity domain logic
     */
    canUserInstallPlugin(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID): Promise<{
        canInstall: boolean;
        reason?: string;
    }>;
    /**
     * Update plugin tenant usage counters
     * Enhanced with entity domain methods and validation
     */
    updatePluginTenantUsage(pluginId: ID, tenantId: ID, action: 'install' | 'uninstall' | 'activate' | 'deactivate', organizationId?: ID): Promise<void>;
}
export {};
