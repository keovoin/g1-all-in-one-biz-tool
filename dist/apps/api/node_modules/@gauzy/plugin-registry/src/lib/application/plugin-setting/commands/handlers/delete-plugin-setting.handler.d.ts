import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { DeletePluginSettingCommand } from '../delete-plugin-setting.command';
export declare class DeletePluginSettingHandler implements ICommandHandler<DeletePluginSettingCommand> {
    private readonly pluginSettingService;
    private readonly eventBus;
    private readonly logger;
    constructor(pluginSettingService: PluginSettingService, eventBus: EventBus);
    execute(command: DeletePluginSettingCommand): Promise<void>;
}
