import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { BulkUpdatePluginSettingsDTO } from '../../../shared';
export declare class BulkUpdatePluginSettingsCommand implements ICommand {
    readonly bulkUpdateDto: BulkUpdatePluginSettingsDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Setting] Bulk Update";
    constructor(bulkUpdateDto: BulkUpdatePluginSettingsDTO, tenantId: ID, organizationId?: ID, userId?: ID);
}
