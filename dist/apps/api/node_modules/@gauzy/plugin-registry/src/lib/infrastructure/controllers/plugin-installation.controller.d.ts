import { ID, IPluginInstallation } from '@gauzy/contracts';
import { HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InstallPluginDTO } from '../../shared';
export declare class PluginInstallationController {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    create(id: ID, body: InstallPluginDTO): Promise<IPluginInstallation>;
    remove(pluginId: ID, installationId: ID): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
}
