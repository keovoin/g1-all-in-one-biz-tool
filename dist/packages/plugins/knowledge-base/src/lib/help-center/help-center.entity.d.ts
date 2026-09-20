import { IHelpCenter, IHelpCenterArticle } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class HelpCenter extends TenantOrganizationBaseEntity implements IHelpCenter {
    name: string;
    flag: string;
    icon: string;
    privacy: string;
    language: string;
    color: string;
    description?: string;
    data?: string;
    index: number;
    parent?: IHelpCenter;
    parentId?: string;
    children?: IHelpCenter[];
    articles?: IHelpCenterArticle[];
}
