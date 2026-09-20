import { ICommand } from '@nestjs/cqrs';
import { PluginTenantApprovalDTO } from '../../../shared/dto/plugin-tenant-approval.dto';
export declare class ApprovePluginTenantCommand implements ICommand {
    readonly input: PluginTenantApprovalDTO;
    static readonly type = "[Plugin Tenant] Approve";
    constructor(input: PluginTenantApprovalDTO);
}
