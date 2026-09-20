import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { CreatePluginSettingCommand } from '../create-plugin-setting.command';
export declare class CreatePluginSettingHandler implements ICommandHandler<CreatePluginSettingCommand> {
    private readonly pluginSettingService;
    private readonly eventBus;
    private readonly logger;
    constructor(pluginSettingService: PluginSettingService, eventBus: EventBus);
    execute(command: CreatePluginSettingCommand): Promise<IPluginSetting>;
}
