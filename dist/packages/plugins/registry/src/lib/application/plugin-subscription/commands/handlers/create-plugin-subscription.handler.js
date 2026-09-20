"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_subscription_command_1 = require("../create-plugin-subscription.command");
let CreatePluginSubscriptionCommandHandler = class CreatePluginSubscriptionCommandHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    async execute(command) {
        const { createDto } = command;
        // Transform date strings to Date objects for service compatibility
        const transformedDto = {
            ...createDto,
            scope: createDto.scope,
            pluginTenantId: createDto.pluginTenantId,
            status: createDto.status ?? contracts_1.PluginSubscriptionStatus.ACTIVE, // Default to active if not specified
            autoRenew: createDto.autoRenew ?? false, // Default to false if not specified
            ...(createDto.startDate && { startDate: new Date(createDto.startDate) }),
            ...(createDto.endDate && { endDate: new Date(createDto.endDate) }),
            ...(createDto.trialEndDate && { trialEndDate: new Date(createDto.trialEndDate) })
        };
        // Check if user already has a subscription for this plugin
        // The subscriberId might be in metadata or as a passed property
        const subscriberId = transformedDto.metadata?.subscriberId || transformedDto.subscriberId;
        if (subscriberId && createDto.pluginId) {
            const existingSubscription = await this.pluginSubscriptionService.findOneByOptions({
                where: {
                    pluginId: createDto.pluginId,
                    subscriberId: subscriberId
                }
            });
            if (existingSubscription) {
                // If user has an active or trial subscription, reject the creation
                if ([
                    contracts_1.PluginSubscriptionStatus.ACTIVE,
                    contracts_1.PluginSubscriptionStatus.PENDING,
                    contracts_1.PluginSubscriptionStatus.TRIAL
                ].includes(existingSubscription.status)) {
                    throw new common_1.BadRequestException('You already have an active subscription for this plugin. Please use upgrade or downgrade to change your plan.');
                }
                // If the existing subscription is cancelled or expired, we need to delete it before creating new one
                // This ensures we don't violate the unique constraint on pluginId + subscriberId
                if (existingSubscription.status === contracts_1.PluginSubscriptionStatus.CANCELLED ||
                    existingSubscription.status === contracts_1.PluginSubscriptionStatus.EXPIRED) {
                    console.log(`Deleting ${existingSubscription.status} subscription ${existingSubscription.id} to replace with new subscription`);
                    // Delete the old subscription to avoid unique constraint violation
                    await this.pluginSubscriptionService.delete(existingSubscription.id);
                }
            }
        }
        try {
            return await this.pluginSubscriptionService.create(transformedDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create plugin subscription: ${error.message}`);
        }
    }
};
exports.CreatePluginSubscriptionCommandHandler = CreatePluginSubscriptionCommandHandler;
exports.CreatePluginSubscriptionCommandHandler = CreatePluginSubscriptionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_subscription_command_1.CreatePluginSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], CreatePluginSubscriptionCommandHandler);
//# sourceMappingURL=create-plugin-subscription.handler.js.map