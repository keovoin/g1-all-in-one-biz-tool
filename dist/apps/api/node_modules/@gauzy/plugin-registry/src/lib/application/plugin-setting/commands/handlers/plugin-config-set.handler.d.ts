import { ICommandHandler } from '@nestjs/cqrs';
import { PluginConfigSetCommand } from '../plugin-config-set.command';
export declare class PluginConfigSetHandler implements ICommandHandler<PluginConfigSetCommand> {
    execute(command: PluginConfigSetCommand): Promise<any>;
}
