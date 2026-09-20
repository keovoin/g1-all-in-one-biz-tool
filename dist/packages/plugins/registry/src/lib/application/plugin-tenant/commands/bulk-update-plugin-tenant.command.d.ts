import { ICommand } from '@nestjs/cqrs';
import { PluginTenantBulkOperationDTO } from '../../../shared/dto/plugin-tenant-bulk-operation.dto';
export declare class BulkUpdatePluginTenantCommand implements ICommand {
    readonly input: PluginTenantBulkOperationDTO;
    static readonly type = "[Plugin Tenant] Bulk Update";
    constructor(input: PluginTenantBulkOperationDTO);
}
