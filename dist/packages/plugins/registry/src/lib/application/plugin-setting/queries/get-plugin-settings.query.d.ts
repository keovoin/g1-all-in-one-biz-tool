import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { IPluginSetting } from '../../../shared';
export declare class GetPluginSettingsQuery implements IQuery {
    readonly options?: FindManyOptions<IPluginSetting>;
    readonly tenantId?: string;
    readonly organizationId?: string;
    static readonly type = "[Plugin Setting] Get Settings";
    constructor(options?: FindManyOptions<IPluginSetting>, tenantId?: string, organizationId?: string);
}
