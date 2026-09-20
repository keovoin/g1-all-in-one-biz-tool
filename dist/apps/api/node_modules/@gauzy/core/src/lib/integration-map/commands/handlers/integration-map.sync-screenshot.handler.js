"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncScreenshotHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const integration_map_sync_entity_command_1 = require("../integration-map.sync-entity.command");
const integration_map_sync_screenshot_command_1 = require("../integration-map.sync-screenshot.command");
const integration_map_service_1 = require("../../integration-map.service");
const context_1 = require("../../../core/context");
const commands_1 = require("../../../time-tracking/screenshot/commands");
let IntegrationMapSyncScreenshotHandler = class IntegrationMapSyncScreenshotHandler {
    constructor(_commandBus, _integrationMapService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
    }
    /**
     * Handles the integration and mapping of third-party screenshots.
     *
     * @param {IntegrationMapSyncScreenshotCommand} command - The command containing the data required for screenshot integration and mapping.
     * @returns {Promise<IIntegrationMap>} - The integration map of the screenshot.
     * @throws {BadRequestException} - Throws an exception if screenshot integration or mapping fails.
     */
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        const { integrationId, sourceId, organizationId, entity } = input;
        const { time_slot, full_url, thumb_url, recorded_at, employeeId } = entity;
        try {
            // Find the existing integration map for the screenshot
            const screenshotMap = await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.SCREENSHOT,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
            // Update the existing screenshot with the new data
            await this._commandBus.execute(new commands_1.ScreenshotUpdateCommand(Object.assign({}, {
                id: screenshotMap.gauzyId,
                recordedAt: recorded_at,
                activityTimestamp: time_slot,
                file: full_url,
                thumb: thumb_url,
                employeeId
            })));
            return screenshotMap;
        }
        catch (error) {
            // If no existing map is found, create a new screenshot and map it
            const gauzyScreenshot = await this._commandBus.execute(new commands_1.ScreenshotCreateCommand({
                file: full_url,
                thumb: thumb_url,
                recordedAt: recorded_at,
                activityTimestamp: time_slot,
                employeeId,
                organizationId
            }));
            return await this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                gauzyId: gauzyScreenshot.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.SCREENSHOT,
                organizationId
            }));
        }
    }
};
exports.IntegrationMapSyncScreenshotHandler = IntegrationMapSyncScreenshotHandler;
exports.IntegrationMapSyncScreenshotHandler = IntegrationMapSyncScreenshotHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_screenshot_command_1.IntegrationMapSyncScreenshotCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService])
], IntegrationMapSyncScreenshotHandler);
//# sourceMappingURL=integration-map.sync-screenshot.handler.js.map