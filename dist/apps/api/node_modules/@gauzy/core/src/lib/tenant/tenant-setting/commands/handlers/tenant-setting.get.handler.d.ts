import { ICommandHandler } from '@nestjs/cqrs';
import { TenantSettingGetCommand } from '../tenant-setting.get.command';
import { TenantSettingService } from './../../tenant-setting.service';
export declare class TenantSettingGetHandler implements ICommandHandler<TenantSettingGetCommand> {
    private readonly _tenantSettingService;
    constructor(_tenantSettingService: TenantSettingService);
    /**
     * Executes the retrieval and processing of tenant settings.
     *
     * @returns {Promise<Record<string, any>>} - Returns an object containing the tenant settings with secrets wrapped for various cloud storage providers and monitoring services.
     *
     * @throws {Error} - Throws an error if the operation fails.
     */
    execute(): Promise<Record<string, any>>;
}
