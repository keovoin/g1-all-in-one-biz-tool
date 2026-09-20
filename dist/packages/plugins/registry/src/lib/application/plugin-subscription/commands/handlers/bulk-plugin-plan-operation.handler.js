"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkPluginPlanOperationCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const bulk_plugin_plan_operation_command_1 = require("../bulk-plugin-plan-operation.command");
let BulkPluginPlanOperationCommandHandler = class BulkPluginPlanOperationCommandHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(command) {
        const { operationDto } = command;
        try {
            await this.pluginSubscriptionPlanService.bulkOperation(operationDto.planIds, operationDto.operation);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to perform bulk operation on plugin plans: ${error.message}`);
        }
    }
};
exports.BulkPluginPlanOperationCommandHandler = BulkPluginPlanOperationCommandHandler;
exports.BulkPluginPlanOperationCommandHandler = BulkPluginPlanOperationCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(bulk_plugin_plan_operation_command_1.BulkPluginPlanOperationCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], BulkPluginPlanOperationCommandHandler);
//# sourceMappingURL=bulk-plugin-plan-operation.handler.js.map