"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const plugin_subscription_1 = require("../../../plugin-subscription");
const create_plugin_command_1 = require("../create-plugin.command");
let CreatePluginCommandHandler = class CreatePluginCommandHandler {
    constructor(versionService, sourceService, pluginService, dataSource, commandBus) {
        this.versionService = versionService;
        this.sourceService = sourceService;
        this.pluginService = pluginService;
        this.dataSource = dataSource;
        this.commandBus = commandBus;
    }
    /**
     * Executes the create plugin command
     *
     * @param command - The command containing plugin creation data
     * @returns The created plugin
     * @throws BadRequestException if validation fails
     */
    async execute(command) {
        const { input } = command;
        if (!input || !input.version || (Array.isArray(input.version.sources) && input.version.sources.length === 0)) {
            throw new common_1.BadRequestException('Invalid plugin data: Source requires version information');
        }
        const { subscriptionPlans = [], ...pluginInput } = input;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Create the plugin (subscriptionPlans are handled separately below)
            const plugin = domain_1.Plugin.create(pluginInput);
            // Check if has plans
            const requiresSubscription = subscriptionPlans && subscriptionPlans.length > 0;
            // Requires subscription if plans are provided
            plugin.requiresSubscription = requiresSubscription;
            // Save the plugin
            const savedPlugin = await this.pluginService.save(plugin);
            // Process source and version if provided
            if (pluginInput.version.sources.length > 0) {
                const savedSource = await this.sourceService.createSources(pluginInput.version.sources);
                await this.versionService.createVersion(pluginInput.version, savedPlugin, savedSource);
            }
            // Create subscription plans if provided
            if (requiresSubscription) {
                const tenantId = core_1.RequestContext.currentTenantId();
                const organizationId = core_1.RequestContext.currentOrganizationId();
                const user = core_1.RequestContext.currentUser();
                // Attach plugin ID to all plans
                const plansWithPluginId = subscriptionPlans.map((planData) => ({
                    ...planData,
                    pluginId: savedPlugin.id
                }));
                // Create all plans at once using bulk create command
                await this.commandBus.execute(new plugin_subscription_1.BulkCreatePluginPlansCommand(plansWithPluginId, tenantId, organizationId, user?.id));
            }
            await queryRunner.commitTransaction();
            // Return the complete plugin with all relations
            const result = await this.pluginService.findOneByIdString(savedPlugin.id, {
                relations: ['versions', 'versions.sources']
            });
            return result;
        }
        catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(`Failed to create plugin: ${error.message}`);
        }
        finally {
            // Release queryRunner resources
            await queryRunner.release();
        }
    }
};
exports.CreatePluginCommandHandler = CreatePluginCommandHandler;
exports.CreatePluginCommandHandler = CreatePluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_command_1.CreatePluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService,
        domain_1.PluginSourceService,
        domain_1.PluginService,
        typeorm_1.DataSource,
        cqrs_1.CommandBus])
], CreatePluginCommandHandler);
//# sourceMappingURL=create-plugin-command.handler.js.map