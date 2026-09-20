import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { BulkUpdatePluginSettingsCommand } from '../bulk-update-plugin-settings.command';
export declare class BulkUpdatePluginSettingsHandler implements ICommandHandler<BulkUpdatePluginSettingsCommand> {
    private readonly pluginSettingService;
    private readonly eventBus;
    private readonly dataSource;
    private readonly logger;
    constructor(pluginSettingService: PluginSettingService, eventBus: EventBus, dataSource: DataSource);
    execute(command: BulkUpdatePluginSettingsCommand): Promise<IPluginSetting[]>;
}
