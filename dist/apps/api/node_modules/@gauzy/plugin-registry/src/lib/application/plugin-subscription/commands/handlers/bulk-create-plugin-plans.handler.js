"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreatePluginPlansHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const strategies_1 = require("../../../strategies");
const bulk_create_plugin_plans_command_1 = require("../bulk-create-plugin-plans.command");
let BulkCreatePluginPlansHandler = class BulkCreatePluginPlansHandler {
    constructor(commandBus, dataSource) {
        this.commandBus = commandBus;
        this.dataSource = dataSource;
    }
    /**
     * Executes the bulk create plugin plans command
     *
     * @param command - The command containing multiple plans creation data
     * @returns Array of created plugin subscription plans
     * @throws BadRequestException if validation fails
     */
    async execute(command) {
        const { plans, tenantId, organizationId, userId } = command;
        if (!plans || plans.length === 0) {
            throw new common_1.BadRequestException('At least one plan must be provided');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Create all plans within a transaction
            // Use strategy pattern to handle create/update operations
            const context = {
                pluginId: null,
                tenantId,
                organizationId,
                userId,
                commandBus: this.commandBus
            };
            const createdPlans = await Promise.all(plans.map((planData) => strategies_1.SubscriptionPlanOperationFactory.execute(planData, context)));
            await queryRunner.commitTransaction();
            // Return the created plans
            return createdPlans;
        }
        catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(`Failed to create plugin plans: ${error.message}`);
        }
        finally {
            // Release queryRunner resources
            await queryRunner.release();
        }
    }
};
exports.BulkCreatePluginPlansHandler = BulkCreatePluginPlansHandler;
exports.BulkCreatePluginPlansHandler = BulkCreatePluginPlansHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(bulk_create_plugin_plans_command_1.BulkCreatePluginPlansCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, typeorm_1.DataSource])
], BulkCreatePluginPlansHandler);
//# sourceMappingURL=bulk-create-plugin-plans.handler.js.map