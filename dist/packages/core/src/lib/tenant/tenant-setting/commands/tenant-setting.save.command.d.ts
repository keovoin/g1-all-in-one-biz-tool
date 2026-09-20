import { ICommand } from '@nestjs/cqrs';
import { ITenantSetting } from '@gauzy/contracts';
export declare class TenantSettingSaveCommand implements ICommand {
    readonly input: ITenantSetting;
    readonly tenantId?: string;
    static readonly type = "[Tenant] Setting Save";
    constructor(input: ITenantSetting, tenantId?: string);
}
