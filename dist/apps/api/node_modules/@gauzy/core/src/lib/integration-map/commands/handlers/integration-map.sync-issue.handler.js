"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncIssueHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../core/context");
const task_service_1 = require("../../../tasks/task.service");
const commands_1 = require("../../../tasks/commands");
const integration_map_sync_entity_command_1 = require("./../integration-map.sync-entity.command");
const integration_map_sync_issue_command_1 = require("./../integration-map.sync-issue.command");
const integration_map_service_1 = require("../../integration-map.service");
let IntegrationMapSyncIssueHandler = class IntegrationMapSyncIssueHandler {
    constructor(_commandBus, _integrationMapService, _taskService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
        this._taskService = _taskService;
    }
    /**
     * Execute the IntegrationMapSyncIssueCommand to sync GitHub issues and update tasks.
     *
     * @param command - The IntegrationMapSyncIssueCommand containing the request data.
     * @returns A promise that resolves to the updated integration map.
     */
    async execute(command) {
        const { triggeredEvent, request } = command;
        const { sourceId, organizationId, integrationId, entity } = request;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        try {
            // Check if an integration map already exists for the issue
            const integrationMap = await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.ISSUE,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
            // Try to find the corresponding task
            try {
                await this._taskService.findOneByIdString(integrationMap.gauzyId);
                // Update the corresponding task with the new input data
                await this._commandBus.execute(new commands_1.TaskUpdateCommand(integrationMap.gauzyId, entity, triggeredEvent));
            }
            catch (error) {
                // Create a corresponding task with the new input data
                await this._commandBus.execute(new commands_1.TaskCreateCommand({
                    ...entity,
                    id: integrationMap.gauzyId
                }));
            }
            // Return the integration map
            return integrationMap;
        }
        catch (error) {
            // Handle errors and create a new task
            // Create a new task with the provided entity data
            const task = await this._commandBus.execute(new commands_1.TaskCreateCommand(entity, triggeredEvent));
            // Create a new integration map for the issue
            return await this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                gauzyId: task.id,
                entity: contracts_1.IntegrationEntity.ISSUE,
                integrationId,
                sourceId,
                organizationId,
                tenantId
            }));
        }
    }
};
exports.IntegrationMapSyncIssueHandler = IntegrationMapSyncIssueHandler;
exports.IntegrationMapSyncIssueHandler = IntegrationMapSyncIssueHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_issue_command_1.IntegrationMapSyncIssueCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService,
        task_service_1.TaskService])
], IntegrationMapSyncIssueHandler);
//# sourceMappingURL=integration-map.sync-issue.handler.js.map