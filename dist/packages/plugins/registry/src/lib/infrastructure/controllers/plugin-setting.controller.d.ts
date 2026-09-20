import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PluginSetting, PluginSettingService } from '../../domain';
import { BulkUpdatePluginSettingsDTO, CreatePluginSettingDTO, IPluginSetting, PluginSettingQueryDTO } from '../../shared';
export declare class PluginSettingController {
    private readonly commandBus;
    private readonly queryBus;
    private readonly pluginSettingService;
    constructor(commandBus: CommandBus, queryBus: QueryBus, pluginSettingService: PluginSettingService);
    create(pluginId: string, createDto: CreatePluginSettingDTO): Promise<IPluginSetting>;
    findAll(pluginId: string, query: PluginSettingQueryDTO): Promise<IPluginSetting[]>;
    findOne(pluginId: string, id: string): Promise<IPluginSetting>;
    bulkUpdateSettings(pluginId: string, bulkUpdateDto: BulkUpdatePluginSettingsDTO): Promise<PluginSetting[]>;
    updateAndValidate(pluginId: string, id: string, updateData: {
        value: any;
        [key: string]: any;
    }): Promise<{
        setting: IPluginSetting;
        validation: {
            valid: boolean;
            errors?: string[];
        };
    }>;
    delete(pluginId: string, id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}
