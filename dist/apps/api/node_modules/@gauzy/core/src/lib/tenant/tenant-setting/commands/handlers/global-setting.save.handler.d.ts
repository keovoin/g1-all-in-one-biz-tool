import { ICommandHandler } from '@nestjs/cqrs';
import { ITenantSetting } from '@gauzy/contracts';
import { TenantSettingService } from '../../tenant-setting.service';
import { GlobalSettingSaveCommand } from '../global-setting.save.command';
export declare class GlobalSettingSaveHandler implements ICommandHandler<GlobalSettingSaveCommand> {
    private readonly _tenantSettingService;
    constructor(_tenantSettingService: TenantSettingService);
    execute(command: GlobalSettingSaveCommand): Promise<ITenantSetting>;
}
