import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class SubmitPluginForReviewCommand implements ICommand {
    readonly pluginId: ID;
    readonly reviewNotes?: string;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin] Submit For Review";
    constructor(pluginId: ID, reviewNotes?: string, tenantId?: ID, organizationId?: ID, userId?: ID);
}
