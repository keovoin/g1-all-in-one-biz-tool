import { CommandBus } from '@nestjs/cqrs';
import { ITenantSetting } from '@gauzy/contracts';
import { CrudController } from '../../core/crud';
import { TenantSetting } from './tenant-setting.entity';
import { TenantSettingService } from './tenant-setting.service';
import { CreateTenantSettingDTO, DynamicSettingDTO, WasabiS3ProviderConfigDTO } from './dto';
export declare class TenantSettingController extends CrudController<TenantSetting> {
    private readonly tenantSettingService;
    private readonly commandBus;
    constructor(tenantSettingService: TenantSettingService, commandBus: CommandBus);
    getGlobalSettings(): Promise<Record<string, any>>;
    getSettings(): Promise<Record<string, any>>;
    findById(id: string): Promise<TenantSetting>;
    saveSettings(entity: CreateTenantSettingDTO): Promise<ITenantSetting>;
    saveDynamicSettings(entity: DynamicSettingDTO): Promise<ITenantSetting>;
    saveGlobalSettings(entity: DynamicSettingDTO): Promise<ITenantSetting>;
    validateWasabiConfiguration(entity: WasabiS3ProviderConfigDTO): Promise<void | any>;
}
