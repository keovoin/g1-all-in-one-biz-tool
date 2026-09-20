"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncLabelHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../core/context");
const commands_1 = require("../../../tags/commands");
const tag_service_1 = require("../../../tags/tag.service");
const integration_map_sync_entity_command_1 = require("./../integration-map.sync-entity.command");
const integration_map_sync_label_command_1 = require("./../integration-map.sync-label.command");
const integration_map_service_1 = require("../../integration-map.service");
let IntegrationMapSyncLabelHandler = class IntegrationMapSyncLabelHandler {
    constructor(_commandBus, _integrationMapService, _tagService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
        this._tagService = _tagService;
    }
    /**
     * Execute the IntegrationMapSyncLabelCommand to sync GitHub labels and update tags.
     *
     * @param command - The IntegrationMapSyncLabelCommand containing the request data.
     * @returns A promise that resolves to the updated integration map.
     */
    async execute(command) {
        const { request } = command;
        const { sourceId, organizationId, integrationId, entity } = request;
        const { name, color, description, isSystem } = entity;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        try {
            // Check if an integration map already exists for the issue
            const integrationMap = await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.LABEL,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
            // Try to find the corresponding tag
            try {
                await this._tagService.findOneByIdString(integrationMap.gauzyId);
                // Update the corresponding task with the new input data
                return await this._commandBus.execute(new commands_1.TagUpdateCommand(integrationMap.gauzyId, entity));
            }
            catch (error) {
                // Create a corresponding tag with the new input data
                return await this._commandBus.execute(new commands_1.TagCreateCommand({
                    id: integrationMap.gauzyId,
                    name,
                    color,
                    description,
                    isSystem,
                    organizationId,
                    tenantId
                }));
            }
        }
        catch (error) {
            const tag = await this._commandBus.execute(new commands_1.TagCreateCommand({
                name,
                color,
                description,
                isSystem,
                organizationId,
                tenantId
            }));
            await this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                gauzyId: tag.id,
                entity: contracts_1.IntegrationEntity.LABEL,
                integrationId,
                sourceId,
                organizationId,
                tenantId
            }));
            return tag;
        }
    }
};
exports.IntegrationMapSyncLabelHandler = IntegrationMapSyncLabelHandler;
exports.IntegrationMapSyncLabelHandler = IntegrationMapSyncLabelHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_label_command_1.IntegrationMapSyncLabelCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService,
        tag_service_1.TagService])
], IntegrationMapSyncLabelHandler);
//# sourceMappingURL=integration-map.sync-label.handler.js.map