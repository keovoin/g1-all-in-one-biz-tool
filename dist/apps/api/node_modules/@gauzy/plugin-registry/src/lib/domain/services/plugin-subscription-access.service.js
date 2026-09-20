"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionAccessService = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_subscription_plan_service_1 = require("./plugin-subscription-plan.service");
const plugin_subscription_service_1 = require("./plugin-subscription.service");
const plugin_tenant_service_1 = require("./plugin-tenant.service");
/**
 * Plugin enabled specification - checks if plugin is enabled for tenant
 * Note: If no pluginTenant exists yet, we allow access (will be created on first use)
 */
class PluginEnabledSpecification {
    isSatisfiedBy(context) {
        // If no pluginTenant configuration exists, allow access (default behavior)
        if (!context.pluginTenant)
            return true;
        return context.pluginTenant.isAvailable();
    }
    getFailureReason() {
        return 'Plugin is not enabled for this tenant';
    }
}
/**
 * Plugin approval specification - checks if plugin is approved when required
 * Note: If no pluginTenant exists yet, we allow access (no approval required by default)
 */
class PluginApprovalSpecification {
    isSatisfiedBy(context) {
        // If no pluginTenant configuration exists, no approval is required
        if (!context.pluginTenant)
            return true;
        // If approval is not required, specification is satisfied
        if (!context.pluginTenant.needsApprovalForInstallation()) {
            return true;
        }
        // If approval is required, check if it's approved
        return context.pluginTenant.isApproved();
    }
    getFailureReason() {
        return 'Plugin requires approval and has not been approved yet';
    }
}
/**
 * User access specification - checks user-specific permissions
 */
class UserAccessSpecification {
    isSatisfiedBy(context) {
        if (!context.pluginTenant || !context.userId)
            return true;
        // Use the domain method from PluginTenant entity
        return context.pluginTenant.hasUserAccess(context.userId, context.userRoles || []);
    }
    getFailureReason() {
        return 'User is explicitly denied access or not in allowed list';
    }
}
/**
 * Quota availability specification - uses entity domain logic
 */
class QuotaAvailabilitySpecification {
    isSatisfiedBy(context) {
        if (!context.pluginTenant)
            return true;
        // Use domain methods from PluginTenant entity
        return (context.pluginTenant.canInstallMore() && (context.userId ? context.pluginTenant.canAddMoreUsers() : true));
    }
    getFailureReason() {
        return 'Installation or user quota has been exceeded';
    }
}
/**
 * Composite access validator using Specification pattern
 */
class AccessValidator {
    constructor() {
        this.specifications = [
            new PluginEnabledSpecification(),
            new PluginApprovalSpecification(),
            new UserAccessSpecification(),
            new QuotaAvailabilitySpecification()
        ];
    }
    /**
     * Validates all access specifications
     */
    validate(context) {
        const failureReasons = [];
        for (const spec of this.specifications) {
            if (!spec.isSatisfiedBy(context)) {
                failureReasons.push(spec.getFailureReason());
            }
        }
        return {
            isValid: failureReasons.length === 0,
            failureReasons
        };
    }
}
/**
 * Factory for creating subscription access contexts
 * Enhanced with domain logic from entities
 */
class SubscriptionAccessContextFactory {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
        this.accessValidator = new AccessValidator();
    }
    /**
     * Creates access context for free plugins using entity domain logic
     */
    async createFreeAccessContext(pluginId, tenantId, organizationId, userId, userRoles) {
        // Get or create plugin tenant configuration
        const pluginTenant = await this.getOrCreatePluginTenant(pluginId, tenantId, organizationId);
        const context = {
            pluginId,
            tenantId,
            organizationId,
            userId,
            userRoles,
            pluginTenant
        };
        const validation = this.accessValidator.validate(context);
        if (!validation.isValid) {
            return {
                hasAccess: false,
                subscription: null,
                pluginTenant,
                accessLevel: null,
                canAssign: false,
                canActivate: false,
                canManage: false,
                requiresSubscription: false,
                denialReasons: validation.failureReasons
            };
        }
        return {
            hasAccess: true,
            subscription: null,
            pluginTenant,
            accessLevel: pluginTenant?.scope || null,
            canAssign: pluginTenant ? await this.determineAssignmentPermissions(pluginTenant.id, null, userId) : false,
            canActivate: await this.determineActivationPermissions(pluginTenant, null, userId),
            canManage: await this.determineManagementPermissions(pluginTenant, null, userId),
            requiresSubscription: false,
            denialReasons: [],
            quotaInfo: this.calculateQuotaInfo(pluginTenant)
        };
    }
    /**
     * Creates access context for paid plugins using entity domain logic
     */
    async createPaidAccessContext(subscription, pluginId, tenantId, organizationId, userId, userRoles) {
        const pluginTenant = await this.getOrCreatePluginTenant(pluginId, tenantId, organizationId);
        const context = {
            pluginId,
            tenantId,
            organizationId,
            userId,
            userRoles,
            pluginTenant,
            subscription
        };
        const validation = this.accessValidator.validate(context);
        const subscriptionValid = subscription ? subscription.isSubscriptionActive : false;
        // Additional subscription validity check
        if (subscription && !subscriptionValid) {
            validation.failureReasons.push('Subscription is not active or has expired');
        }
        const hasAccess = validation.isValid && subscriptionValid;
        const accessLevel = subscription?.scope || pluginTenant?.scope || null;
        return {
            hasAccess,
            subscription,
            pluginTenant,
            accessLevel,
            canAssign: hasAccess && pluginTenant
                ? await this.determineAssignmentPermissions(pluginTenant.id, subscription, userId)
                : false,
            canActivate: hasAccess
                ? await this.determineActivationPermissions(pluginTenant, subscription, userId)
                : false,
            canManage: hasAccess
                ? await this.determineManagementPermissions(pluginTenant, subscription, userId)
                : false,
            requiresSubscription: true,
            denialReasons: validation.failureReasons,
            quotaInfo: this.calculateQuotaInfo(pluginTenant)
        };
    }
    /**
     * Get or create plugin tenant using service
     */
    async getOrCreatePluginTenant(pluginId, tenantId, organizationId) {
        try {
            const existing = await this.pluginTenantService.findByPluginAndTenant(pluginId, tenantId, organizationId);
            if (existing)
                return existing;
            // Create with default settings if not found
            const pluginTenantId = await this.pluginTenantService.findOrCreate({ pluginId, tenantId, organizationId });
            return await this.pluginTenantService.findOneByIdString(pluginTenantId);
        }
        catch {
            return null;
        }
    }
    /**
     * Determine assignment permissions using entity domain logic
     */
    async determineAssignmentPermissions(pluginTenantId, subscription, userId) {
        if (!pluginTenantId || !userId)
            return false;
        const { record: pluginTenant, success } = await this.pluginTenantService.findOneOrFailByIdString(pluginTenantId, {
            relations: ['allowedUsers', 'deniedUsers', 'allowedRoles']
        });
        if (!success)
            return false;
        // Check if subscription allows assignment using entity method
        const subscriptionAllowsAssignment = subscription ? subscription.hasAssignmentPermissions() : false;
        // Check if plugin tenant scope allows assignment
        const tenantScopeAllowsAssignment = pluginTenant.scope === contracts_1.PluginScope.TENANT || pluginTenant.scope === contracts_1.PluginScope.ORGANIZATION;
        // User must have access to the plugin tenant
        const userHasAccess = pluginTenant.hasUserAccess(userId, []);
        return subscriptionAllowsAssignment && tenantScopeAllowsAssignment && userHasAccess;
    }
    /**
     * Determine activation permissions using entity domain logic
     */
    async determineActivationPermissions(pluginTenant, subscription, userId) {
        if (!userId)
            return false;
        // Check if subscription can be activated using entity method
        if (subscription) {
            const isDirectSubscriber = subscription.subscriberId === userId;
            const isParentSubscription = !subscription.isInherited();
            return (isDirectSubscriber || isParentSubscription) && subscription.isSubscriptionActive;
        }
        // For free plugins, check if user has access to plugin tenant
        return pluginTenant ? pluginTenant.hasUserAccess(userId, []) : false;
    }
    /**
     * Determine management permissions using entity domain logic
     */
    async determineManagementPermissions(pluginTenant, subscription, userId) {
        if (!userId)
            return false;
        // Check if user can manage subscription using entity method
        if (subscription) {
            return subscription.canBeManagedByUser(userId);
        }
        // For free plugins, check if user has administrative access
        return pluginTenant ? pluginTenant.hasUserAccess(userId, []) : false;
    }
    /**
     * Calculate quota information using entity virtual properties
     */
    calculateQuotaInfo(pluginTenant) {
        if (!pluginTenant)
            return undefined;
        return {
            installationUsage: pluginTenant.currentInstallations || 0,
            installationLimit: pluginTenant.maxInstallations,
            userUsage: pluginTenant.currentActiveUsers || 0,
            userLimit: pluginTenant.maxActiveUsers,
            quotaExceeded: pluginTenant.isQuotaExceeded,
            installationUtilization: pluginTenant.installationUtilization,
            userUtilization: pluginTenant.userUtilization
        };
    }
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
let PluginSubscriptionAccessService = class PluginSubscriptionAccessService {
    constructor(pluginSubscriptionService, pluginSubscriptionPlanService, pluginTenantService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
        this.pluginTenantService = pluginTenantService;
        // Initialize context factory
        this.accessContextFactory = new SubscriptionAccessContextFactory(this.pluginTenantService);
    }
    /**
     * Find subscription by context parameters
     * Simplified finder that queries the subscription service directly without scope filtering
     */
    async findSubscriptionByContext(context) {
        try {
            const whereOptions = {
                pluginId: context.pluginId,
                tenantId: context.tenantId
            };
            // Add optional filters if provided
            if (context.organizationId) {
                whereOptions.organizationId = context.organizationId;
            }
            if (context.userId) {
                whereOptions.subscriberId = context.userId;
            }
            else {
                // If no user ID is provided, we are looking for organization/tenant level subscriptions
                // We should exclude user-specific subscriptions (which have a subscriberId)
                // However, some org subscriptions might have a subscriberId (the purchaser), so we rely on scope
                whereOptions.scope = (0, typeorm_1.In)([contracts_1.PluginScope.ORGANIZATION, contracts_1.PluginScope.TENANT]);
            }
            if (context.activeOnly !== false) {
                whereOptions.status = (0, typeorm_1.In)([
                    contracts_1.PluginSubscriptionStatus.ACTIVE,
                    contracts_1.PluginSubscriptionStatus.TRIAL,
                    contracts_1.PluginSubscriptionStatus.PENDING
                ]);
            }
            const subscription = await this.pluginSubscriptionService.findOneOrFailByWhereOptions(whereOptions);
            return subscription.success ? subscription.record : null;
        }
        catch {
            return null;
        }
    }
    /**
     * Validate if a user has access to a plugin based on their subscription
     * This checks for subscriptions assigned to this specific user
     * Note: For full access validation including org/tenant subscriptions, use validatePluginAccess()
     */
    async validatePluginUserAccess(pluginId, tenantId, userId) {
        if (!userId || !tenantId)
            return false;
        try {
            const subscription = await this.findSubscriptionByContext({
                pluginId,
                tenantId,
                userId,
                activeOnly: true
            });
            return subscription ? subscription.grantsAccessToUser(userId) : false;
        }
        catch {
            return false;
        }
    }
    /**
     * Validate if a user has access to a plugin based on their subscriptions
     * Uses entity domain logic and specifications pattern
     */
    async validatePluginAccess(pluginId, tenantId, organizationId, userId) {
        try {
            // Check if plugin requires subscription plans first
            const requiresSubscription = await this.requiresSubscription(pluginId);
            if (!requiresSubscription) {
                // For free plugins, validate through PluginTenant only
                const freeContext = await this.accessContextFactory.createFreeAccessContext(pluginId, tenantId, organizationId, userId);
                return freeContext.hasAccess;
            }
            // For paid plugins, validate subscription + plugin tenant access
            const subscription = await this.findSubscriptionByContext({
                pluginId,
                tenantId,
                organizationId,
                userId,
                activeOnly: true
            });
            const paidContext = await this.accessContextFactory.createPaidAccessContext(subscription, pluginId, tenantId, organizationId, userId);
            return paidContext.hasAccess;
        }
        catch (error) {
            // Log error and deny access for safety
            console.error('Error validating plugin access:', error);
            return false;
        }
    }
    /**
     * Validate if a user can access a plugin, throwing an exception if not
     * Enhanced error messaging using domain logic
     */
    async requirePluginAccess(pluginId, tenantId, organizationId, userId) {
        const accessStatus = await this.getPluginAccessStatus(pluginId, tenantId, organizationId, userId);
        if (!accessStatus.hasAccess) {
            const reasons = accessStatus.denialReasons.length > 0 ? accessStatus.denialReasons.join('; ') : 'Access denied';
            throw new common_1.ForbiddenException(`Plugin access denied: ${reasons}`);
        }
    }
    /**
     * Find the applicable subscription for a user
     * Searches for a subscription matching the provided context parameters
     */
    async findApplicableSubscription(pluginId, tenantId, organizationId, userId) {
        return this.findSubscriptionByContext({
            pluginId,
            tenantId,
            organizationId,
            userId,
            activeOnly: true
        });
    }
    /**
     * Check if a user can assign plugin subscriptions to other users
     * Enhanced with entity domain logic
     */
    async canAssignSubscriptions(pluginId, tenantId, organizationId, userId) {
        try {
            const subscription = await this.findApplicableSubscription(pluginId, tenantId, organizationId);
            if (!subscription)
                return false;
            // Use entity domain method for assignment validation
            return subscription.canAssignToUsers() && subscription.canBeManagedByUser(userId || '', organizationId);
        }
        catch {
            return false;
        }
    }
    /**
     * Validate if a user can assign plugin subscriptions, throwing an exception if not
     * Enhanced error messaging
     */
    async requireAssignmentPermission(pluginId, tenantId, organizationId, userId) {
        const canAssign = await this.canAssignSubscriptions(pluginId, tenantId, organizationId, userId);
        if (!canAssign) {
            throw new common_1.ForbiddenException('Assignment permission denied. You need an active organization or tenant-level subscription with assignment privileges.');
        }
    }
    /**
     * Determine the appropriate subscription scope based on subscription type and plan
     * Enhanced with domain logic
     */
    determineSubscriptionScope(subscriptionType, requestedScope) {
        // Use business rules for scope determination
        switch (subscriptionType) {
            case contracts_1.PluginSubscriptionType.FREE:
                return contracts_1.PluginScope.USER; // Free plugins always user scope
            case contracts_1.PluginSubscriptionType.TRIAL:
                // Trial respects requested scope but defaults to user
                return requestedScope || contracts_1.PluginScope.USER;
            default:
                // Paid plans respect the requested scope
                return requestedScope;
        }
    }
    /**
     * Determine the initial subscription status based on subscription type
     * Enhanced with business rules
     */
    determineInitialStatus(subscriptionType) {
        // Use business rules for status determination
        const statusMap = new Map([
            [contracts_1.PluginSubscriptionType.FREE, contracts_1.PluginSubscriptionStatus.ACTIVE],
            [contracts_1.PluginSubscriptionType.TRIAL, contracts_1.PluginSubscriptionStatus.TRIAL],
            [contracts_1.PluginSubscriptionType.BASIC, contracts_1.PluginSubscriptionStatus.PENDING],
            [contracts_1.PluginSubscriptionType.PREMIUM, contracts_1.PluginSubscriptionStatus.PENDING],
            [contracts_1.PluginSubscriptionType.ENTERPRISE, contracts_1.PluginSubscriptionStatus.PENDING]
        ]);
        return statusMap.get(subscriptionType) || contracts_1.PluginSubscriptionStatus.PENDING;
    }
    /**
     * Check if plugin requires a subscription (has paid plans)
     * Delegates to plan service following DIP
     */
    async requiresSubscription(pluginId) {
        return this.pluginSubscriptionPlanService.isSubscriptionRequired(pluginId);
    }
    /**
     * Get subscription details for a plugin and user
     * Enhanced with comprehensive domain information
     */
    async getSubscriptionDetails(pluginId, tenantId, organizationId, userId) {
        const requiresSubscription = await this.requiresSubscription(pluginId);
        if (!requiresSubscription) {
            return this.accessContextFactory.createFreeAccessContext(pluginId, tenantId, organizationId, userId);
        }
        const subscription = await this.findApplicableSubscription(pluginId, tenantId, organizationId, userId);
        return this.accessContextFactory.createPaidAccessContext(subscription, pluginId, tenantId, organizationId, userId);
    }
    /**
     * Get comprehensive plugin access status including PluginTenant controls
     * Enhanced with rich domain information
     */
    async getPluginAccessStatus(pluginId, tenantId, organizationId, userId) {
        try {
            const requiresSubscription = await this.requiresSubscription(pluginId);
            if (!requiresSubscription) {
                return await this.accessContextFactory.createFreeAccessContext(pluginId, tenantId, organizationId, userId);
            }
            const subscription = await this.findApplicableSubscription(pluginId, tenantId, organizationId, userId);
            return await this.accessContextFactory.createPaidAccessContext(subscription, pluginId, tenantId, organizationId, userId);
        }
        catch (error) {
            // Return safe denial state on error
            return {
                hasAccess: false,
                subscription: null,
                pluginTenant: null,
                accessLevel: null,
                canAssign: false,
                canActivate: false,
                canManage: false,
                requiresSubscription: false,
                denialReasons: [`System error: ${error.message}`],
                quotaInfo: undefined
            };
        }
    }
    /**
     * Check if user can install the plugin (considering quotas and permissions)
     * Enhanced with entity domain logic
     */
    async canUserInstallPlugin(pluginId, tenantId, organizationId, userId) {
        const accessStatus = await this.getPluginAccessStatus(pluginId, tenantId, organizationId, userId);
        if (!accessStatus.hasAccess) {
            return {
                canInstall: false,
                reason: accessStatus.denialReasons.join('; ') || 'Access denied'
            };
        }
        // Use entity domain logic for installation validation
        const pluginTenant = accessStatus.pluginTenant;
        if (pluginTenant) {
            // Check quota using entity method
            if (!pluginTenant.canInstallMore()) {
                return {
                    canInstall: false,
                    reason: 'Installation quota exceeded'
                };
            }
            // Check approval using entity method
            if (pluginTenant.needsApprovalForInstallation() && !pluginTenant.isApproved()) {
                return {
                    canInstall: false,
                    reason: 'Plugin installation requires approval'
                };
            }
        }
        return { canInstall: true };
    }
    /**
     * Update plugin tenant usage counters
     * Enhanced with entity domain methods and validation
     */
    async updatePluginTenantUsage(pluginId, tenantId, action, organizationId) {
        try {
            const pluginTenant = await this.pluginTenantService.findByPluginAndTenant(pluginId, tenantId, organizationId);
            if (!pluginTenant) {
                throw new Error('Plugin tenant configuration not found');
            }
            // Use entity domain methods for safe counter updates
            switch (action) {
                case 'install':
                    pluginTenant.incrementInstallations();
                    break;
                case 'uninstall':
                    pluginTenant.decrementInstallations();
                    break;
                case 'activate':
                    pluginTenant.incrementActiveUsers();
                    break;
                case 'deactivate':
                    pluginTenant.decrementActiveUsers();
                    break;
            }
            // Save the updated entity
            await this.pluginTenantService.update(pluginTenant.id, {
                currentInstallations: pluginTenant.currentInstallations,
                currentActiveUsers: pluginTenant.currentActiveUsers
            });
        }
        catch (error) {
            console.error(`Failed to update plugin tenant usage for ${action}:`, error);
            // Don't throw error to avoid breaking the main flow
        }
    }
};
exports.PluginSubscriptionAccessService = PluginSubscriptionAccessService;
exports.PluginSubscriptionAccessService = PluginSubscriptionAccessService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [plugin_subscription_service_1.PluginSubscriptionService,
        plugin_subscription_plan_service_1.PluginSubscriptionPlanService,
        plugin_tenant_service_1.PluginTenantService])
], PluginSubscriptionAccessService);
//# sourceMappingURL=plugin-subscription-access.service.js.map