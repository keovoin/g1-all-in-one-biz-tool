"use strict";
var PluginBillingCreateHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const plugin_billing_create_command_1 = require("../plugin-billing-create.command");
/**
 * Handler for creating plugin billing records
 * Implements CQRS pattern for separation of concerns
 */
let PluginBillingCreateHandler = PluginBillingCreateHandler_1 = class PluginBillingCreateHandler {
    constructor(pluginBillingService, pluginBillingFactory, eventBus) {
        this.pluginBillingService = pluginBillingService;
        this.pluginBillingFactory = pluginBillingFactory;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(PluginBillingCreateHandler_1.name);
    }
    /**
     * Executes the billing creation command
     * @param command - The billing creation command
     * @returns The created billing record
     */
    async execute(command) {
        const { input } = command;
        try {
            this.logger.log(`Creating billing record for subscription: ${input.subscriptionId}`);
            this.logger.debug(`Billing input: ${JSON.stringify(input)}`);
            // Validate billing input
            await this.validateBillingInput(input);
            // Use factory to create billing entity with business logic
            const billingData = await this.pluginBillingFactory.createFromInput(input);
            this.logger.debug(`Billing data after factory: ${JSON.stringify(billingData)}`);
            // Persist the billing record
            const billing = await this.pluginBillingService.create(billingData);
            this.logger.log(`Billing record created successfully: ${billing.id}`);
            // Publish domain event for billing creation
            await this.eventBus.publish(new domain_1.PluginBillingCreatedEvent(billing));
            return billing;
        }
        catch (error) {
            this.logger.error(`Failed to create billing record: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to create billing record: ${error.message}`);
        }
    }
    /**
     * Validates the billing input
     * @param input - The billing creation input
     */
    async validateBillingInput(input) {
        if (!input.subscriptionId) {
            throw new common_1.BadRequestException('Subscription ID is required for billing creation');
        }
        if (!input.amount || input.amount <= 0) {
            throw new common_1.BadRequestException('Billing amount must be greater than zero');
        }
        if (!input.billingDate) {
            throw new common_1.BadRequestException('Billing date is required');
        }
        if (!input.dueDate) {
            throw new common_1.BadRequestException('Due date is required');
        }
        if (new Date(input.dueDate) < new Date(input.billingDate)) {
            throw new common_1.BadRequestException('Due date must be after billing date');
        }
    }
};
exports.PluginBillingCreateHandler = PluginBillingCreateHandler;
exports.PluginBillingCreateHandler = PluginBillingCreateHandler = PluginBillingCreateHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(plugin_billing_create_command_1.PluginBillingCreateCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginBillingService,
        domain_1.PluginBillingFactory,
        cqrs_1.EventBus])
], PluginBillingCreateHandler);
//# sourceMappingURL=plugin-billing-create.handler.js.map