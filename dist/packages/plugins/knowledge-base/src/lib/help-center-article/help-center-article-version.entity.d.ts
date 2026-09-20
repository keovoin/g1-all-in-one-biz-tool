import { ID, IEmployee, IHelpCenterArticle, IHelpCenterArticleVersion, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class HelpCenterArticleVersion extends TenantOrganizationBaseEntity implements IHelpCenterArticleVersion {
    descriptionHtml?: string;
    descriptionJson?: JsonData;
    descriptionBinary?: Uint8Array;
    /**
     * When this version was saved
    */
    lastSavedAt: Date;
    /**
     * Article relation
    */
    article?: IHelpCenterArticle;
    articleId: ID;
    /**
     * Owner (who created this version)
    */
    ownedBy?: IEmployee;
    ownedById?: ID;
}
