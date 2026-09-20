"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncTaskHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const task_service_1 = require("../../../tasks/task.service");
const integration_map_sync_entity_command_1 = require("./../integration-map.sync-entity.command");
const integration_map_sync_task_command_1 = require("./../integration-map.sync-task.command");
const integration_map_service_1 = require("../../integration-map.service");
const context_1 = require("./../../../core/context");
const commands_1 = require("./../../../tasks/commands");
let IntegrationMapSyncTaskHandler = class IntegrationMapSyncTaskHandler {
    constructor(_commandBus, _integrationMapService, _taskService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
        this._taskService = _taskService;
    }
    /**
     * Third party project task integrated and mapped
     *
     * @param command
     * @returns
     */
    async execute(command) {
        const { triggeredEvent, input } = command;
        const { sourceId, organizationId, integrationId, entity } = input;
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        try {
            // Check if an integration map already exists for the issue
            const integrationMap = await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.TASK,
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
                entity: contracts_1.IntegrationEntity.TASK,
                integrationId,
                sourceId,
                organizationId,
                tenantId
            }));
        }
    }
};
exports.IntegrationMapSyncTaskHandler = IntegrationMapSyncTaskHandler;
exports.IntegrationMapSyncTaskHandler = IntegrationMapSyncTaskHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_task_command_1.IntegrationMapSyncTaskCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService,
        task_service_1.TaskService])
], IntegrationMapSyncTaskHandler);
//# sourceMappingURL=integration-map.sync-task.handler.js.map