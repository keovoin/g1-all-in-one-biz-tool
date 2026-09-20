import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { UpdatePluginSettingCommand } from '../update-plugin-setting.command';
export declare class UpdatePluginSettingHandler implements ICommandHandler<UpdatePluginSettingCommand> {
    private readonly pluginSettingService;
    private readonly eventBus;
    private readonly logger;
    constructor(pluginSettingService: PluginSettingService, eventBus: EventBus);
    execute(command: UpdatePluginSettingCommand): Promise<IPluginSetting>;
}
