import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ApprovePluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly reviewerId: ID;
    readonly approvalNotes?: string;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin] Approve";
    constructor(pluginId: ID, reviewerId: ID, approvalNotes?: string, tenantId?: ID, organizationId?: ID);
}
