import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { IIntegrationMap } from '@gauzy/contracts';
import { IntegrationMapSyncScreenshotCommand } from '../integration-map.sync-screenshot.command';
import { IntegrationMapService } from '../../integration-map.service';
export declare class IntegrationMapSyncScreenshotHandler implements ICommandHandler<IntegrationMapSyncScreenshotCommand> {
    private readonly _commandBus;
    private readonly _integrationMapService;
    constructor(_commandBus: CommandBus, _integrationMapService: IntegrationMapService);
    /**
     * Handles the integration and mapping of third-party screenshots.
     *
     * @param {IntegrationMapSyncScreenshotCommand} command - The command containing the data required for screenshot integration and mapping.
     * @returns {Promise<IIntegrationMap>} - The integration map of the screenshot.
     * @throws {BadRequestException} - Throws an exception if screenshot integration or mapping fails.
     */
    execute(command: IntegrationMapSyncScreenshotCommand): Promise<IIntegrationMap>;
}
