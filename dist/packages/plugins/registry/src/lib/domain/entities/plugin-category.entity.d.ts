import { ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import { IPluginCategory } from '../../shared/models/plugin-category.model';
import { IPluginSetting } from '../../shared/models/plugin-setting.model';
import { IPlugin } from '../../shared/models/plugin.model';
export declare class PluginCategory extends TenantOrganizationBaseEntity implements IPluginCategory {
    name: string;
    description?: string;
    slug: string;
    color?: string;
    icon?: string;
    order: number;
    metadata?: Record<string, any>;
    parentId?: ID;
    parent?: Relation<IPluginCategory>;
    children?: Relation<IPluginCategory[]>;
    plugins?: Relation<IPlugin[]>;
    settings?: Relation<IPluginSetting[]>;
    /**
     * Check if this category is a root category (has no parent)
     */
    isRoot(): boolean;
    /**
     * Check if this category has children
     */
    hasChildren(): boolean;
    /**
     * Check if this category can be deleted
     */
    canBeDeleted(): boolean;
}
