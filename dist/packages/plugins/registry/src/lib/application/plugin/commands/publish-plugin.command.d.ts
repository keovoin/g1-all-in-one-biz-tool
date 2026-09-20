import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { PublishPluginDTO } from '../../../shared';
export declare class PublishPluginCommand implements ICommand {
    readonly publishDto: PublishPluginDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin] Publish";
    constructor(publishDto: PublishPluginDTO, tenantId: ID, organizationId?: ID, userId?: ID);
}
