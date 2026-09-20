import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { SetPluginSettingValueCommand } from '../set-plugin-setting-value.command';
export declare class SetPluginSettingValueHandler implements ICommandHandler<SetPluginSettingValueCommand> {
    private readonly pluginSettingService;
    private readonly eventBus;
    private readonly logger;
    constructor(pluginSettingService: PluginSettingService, eventBus: EventBus);
    execute(command: SetPluginSettingValueCommand): Promise<IPluginSetting>;
}
