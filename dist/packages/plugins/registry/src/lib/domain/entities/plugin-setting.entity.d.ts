import { ID, IUser, PluginSettingDataType } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import { IPluginCategory } from '../../shared/models/plugin-category.model';
import { IPluginSetting } from '../../shared/models/plugin-setting.model';
import { IPluginTenant } from '../../shared/models/plugin-tenant.model';
import { IPlugin } from '../../shared/models/plugin.model';
export declare class PluginSetting extends TenantOrganizationBaseEntity implements IPluginSetting {
    key: string;
    value: string;
    isRequired: boolean;
    isEncrypted: boolean;
    description?: string;
    order?: number;
    validationRules?: string;
    dataType: PluginSettingDataType;
    defaultValue?: string;
    pluginId: ID;
    plugin: Relation<IPlugin>;
    pluginTenantId?: ID;
    pluginTenant?: Relation<IPluginTenant>;
    categoryId?: ID;
    category?: Relation<IPluginCategory>;
    updatedBy?: Relation<IUser>;
    updatedById?: ID;
}
