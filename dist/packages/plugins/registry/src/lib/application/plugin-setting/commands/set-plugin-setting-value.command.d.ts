import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { SetPluginSettingValueDTO } from '../../../shared';
export declare class SetPluginSettingValueCommand implements ICommand {
    readonly setValueDto: SetPluginSettingValueDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Setting] Set Value";
    constructor(setValueDto: SetPluginSettingValueDTO, tenantId: ID, organizationId?: ID, userId?: ID);
}
