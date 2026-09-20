import { ICommandHandler } from '@nestjs/cqrs';
import { TenantSettingService } from '../../tenant-setting.service';
import { GlobalSettingGetCommand } from '../global-setting.get.command';
export declare class GlobalSettingGetHandler implements ICommandHandler<GlobalSettingGetCommand> {
    private readonly _tenantSettingService;
    constructor(_tenantSettingService: TenantSettingService);
    execute(command: GlobalSettingGetCommand): Promise<Record<string, any>>;
}
