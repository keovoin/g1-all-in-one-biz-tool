import { ICommandHandler } from '@nestjs/cqrs';
import { PluginConfigGetCommand } from '../plugin-config-get.command';
export declare class PluginConfigGetHandler implements ICommandHandler<PluginConfigGetCommand> {
    execute(command: PluginConfigGetCommand): Promise<any>;
}
