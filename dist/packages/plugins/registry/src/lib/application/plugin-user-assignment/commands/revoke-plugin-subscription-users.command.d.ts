import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { RevokePluginSubscriptionAssignmentDTO } from '../../../shared';
export declare class RevokePluginSubscriptionUsersCommand implements ICommand {
    readonly pluginId: ID;
    readonly revokeDto: RevokePluginSubscriptionAssignmentDTO;
    readonly tenantId: ID;
    readonly organizationId: ID;
    readonly requestingUserId: ID;
    static readonly type = "[Plugin Subscription Access] Revoke Users";
    constructor(pluginId: ID, revokeDto: RevokePluginSubscriptionAssignmentDTO, tenantId: ID, organizationId: ID, requestingUserId: ID);
}
