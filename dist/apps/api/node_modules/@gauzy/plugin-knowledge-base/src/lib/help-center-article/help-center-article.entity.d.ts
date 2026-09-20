import { ID, IEmployee, IHelpCenter, IHelpCenterArticle, IHelpCenterArticleVersion, IHelpCenterAuthor, IOrganizationProject, ITag, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class HelpCenterArticle extends TenantOrganizationBaseEntity implements IHelpCenterArticle {
    name: string;
    description?: string;
    data?: string;
    draft?: boolean;
    privacy?: boolean;
    index: number;
    descriptionHtml?: string;
    descriptionJson?: JsonData;
    descriptionBinary?: Uint8Array;
    isLocked?: boolean;
    color?: string;
    externalId?: string;
    /**
     * Category (HelpCenter)
    */
    category?: IHelpCenter;
    categoryId: ID;
    /**
     * Parent-child hierarchy (self-referencing)
    */
    parent?: IHelpCenterArticle;
    parentId?: ID;
    /**
     * Owner (Employee)
    */
    ownedBy?: IEmployee;
    ownedById?: ID;
    /**
     * Children articles
    */
    children?: IHelpCenterArticle[];
    /**
     * Authors
    */
    authors?: IHelpCenterAuthor[];
    /**
     * Versions
    */
    versions?: IHelpCenterArticleVersion[];
    /**
     * Projects
    */
    projects?: IOrganizationProject[];
    /**
     * Tags
    */
    tags?: ITag[];
}
