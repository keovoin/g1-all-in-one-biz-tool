import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class RejectPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly reviewerId: ID;
    readonly rejectionReason: string;
    readonly rejectionNotes?: string;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin] Reject";
    constructor(pluginId: ID, reviewerId: ID, rejectionReason: string, rejectionNotes?: string, tenantId?: ID, organizationId?: ID);
}
