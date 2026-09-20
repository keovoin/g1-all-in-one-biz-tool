import { IEmployee, IHelpCenterArticle, IHelpCenterAuthor } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class HelpCenterAuthor extends TenantOrganizationBaseEntity implements IHelpCenterAuthor {
    employee?: IEmployee;
    employeeId: string;
    article?: IHelpCenterArticle;
    articleId: string;
}
