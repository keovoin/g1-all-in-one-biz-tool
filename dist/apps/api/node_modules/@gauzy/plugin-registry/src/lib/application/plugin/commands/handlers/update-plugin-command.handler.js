"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const strategies_1 = require("../../../strategies");
const update_plugin_command_1 = require("../update-plugin.command");
let UpdatePluginCommandHandler = class UpdatePluginCommandHandler {
    constructor(versionService, sourceService, pluginService, dataSource, commandBus) {
        this.versionService = versionService;
        this.sourceService = sourceService;
        this.pluginService = pluginService;
        this.dataSource = dataSource;
        this.commandBus = commandBus;
    }
    /**
     * Updates a plugin and its associated source and version
     *
     * @param command - The update plugin command with input data and plugin ID
     * @returns The updated plugin
     * @throws NotFoundException if plugin, source, or version is not found
     * @throws BadRequestException if plugin ID is missing or update fails
     */
    async execute(command) {
        const { input, id } = command;
        if (!id) {
            throw new common_1.BadRequestException('Plugin ID is required');
        }
        if (!input) {
            throw new common_1.BadRequestException('Plugin update input is required');
        }
        // Start a transaction for updating the plugin and related entities
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Validate plugin exists - throws NotFoundException if not found
            const existingPlugin = await this.pluginService.findOneOrFailByIdString(id);
            if (!existingPlugin.success) {
                throw new common_1.NotFoundException(`Plugin with ID "${id}" not found`);
            }
            // Update version and sources if provided
            if (input.version) {
                // Find the existing version by pluginId
                const existingVersion = await this.versionService.findOneByWhereOptions({
                    pluginId: id
                });
                // Update the version with the existing version ID
                const updateVersionDto = {
                    ...input.version,
                    id: existingVersion.id
                };
                await this.versionService.updateVersion(updateVersionDto, id);
                // Update sources in parallel if they exist
                if (input.version.sources?.length > 0) {
                    await Promise.all(input.version.sources.map((source) => this.sourceService.updateSource(source, existingVersion.id)));
                }
            } // Update plugin with only provided fields
            const pluginUpdate = {
                name: input.name,
                type: input.type,
                status: input.status,
                description: input.description,
                isActive: input.isActive,
                repository: input.repository,
                author: input.author,
                license: input.license,
                homepage: input.homepage,
                requiresSubscription: input.requiresSubscription,
                ...(input.categoryId && { categoryId: input.categoryId })
            };
            await this.pluginService.update(id, pluginUpdate);
            // Handle subscription plans if provided
            if (input.subscriptionPlans?.length > 0) {
                const context = {
                    pluginId: id,
                    tenantId: core_1.RequestContext.currentTenantId(),
                    organizationId: core_1.RequestContext.currentOrganizationId(),
                    userId: core_1.RequestContext.currentUser()?.id,
                    commandBus: this.commandBus
                };
                // Use strategy pattern to handle create/update operations
                await Promise.all(input.subscriptionPlans.map((planData) => strategies_1.SubscriptionPlanOperationFactory.execute(planData, context)));
            }
            await queryRunner.commitTransaction();
            // Return the updated plugin with relations
            return this.pluginService.findOneByIdString(id, {
                relations: ['versions', 'versions.sources']
            });
        }
        catch (error) {
            // Roll back transaction on error
            await queryRunner.rollbackTransaction();
            // Re-throw known exceptions
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            // Wrap unknown errors
            throw new common_1.BadRequestException(`Failed to update plugin: ${error.message}`);
        }
        finally {
            // Release resources
            await queryRunner.release();
        }
    }
};
exports.UpdatePluginCommandHandler = UpdatePluginCommandHandler;
exports.UpdatePluginCommandHandler = UpdatePluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_command_1.UpdatePluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService,
        domain_1.PluginSourceService,
        domain_1.PluginService,
        typeorm_1.DataSource,
        cqrs_1.CommandBus])
], UpdatePluginCommandHandler);
//# sourceMappingURL=update-plugin-command.handler.js.map