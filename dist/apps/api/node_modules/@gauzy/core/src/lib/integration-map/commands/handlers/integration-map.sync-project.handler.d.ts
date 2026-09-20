import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { IIntegrationMap } from '@gauzy/contracts';
import { IntegrationMapSyncProjectCommand } from './../integration-map.sync-project.command';
import { IntegrationMapService } from '../../integration-map.service';
export declare class IntegrationMapSyncProjectHandler implements ICommandHandler<IntegrationMapSyncProjectCommand> {
    private readonly _commandBus;
    private readonly _integrationMapService;
    constructor(_commandBus: CommandBus, _integrationMapService: IntegrationMapService);
    /**
     * Third party organization project integration and mapping.
     *
     * @param {IntegrationMapSyncProjectCommand} command - The command containing input data for integrating and mapping the project.
     * @returns {Promise<IIntegrationMap>} - Returns a promise that resolves with the mapped project integration data.
     */
    execute(command: IntegrationMapSyncProjectCommand): Promise<IIntegrationMap>;
}
