import { IBasePerTenantAndOrganizationEntityModel, IBaseRelationsEntityModel, ID, JsonData } from './base-entity.model';
import { IEmployee } from './employee.model';
import { IOrganizationProject } from './organization-projects.model';
import { ITag } from './tag.model';
export interface IHelpCenterArticle extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
    description?: string;
    data?: string;
    index: number;
    draft?: boolean;
    privacy?: boolean;
    categoryId: ID;
    employees?: IEmployee[];
    authors?: IHelpCenterAuthor[];
    descriptionHtml?: string;
    descriptionJson?: JsonData;
    descriptionBinary?: Uint8Array;
    parentId?: ID;
    parent?: IHelpCenterArticle;
    children?: IHelpCenterArticle[];
    ownedById?: ID;
    ownedBy?: IEmployee;
    projects?: IOrganizationProject[];
    isLocked?: boolean;
    color?: string;
    externalId?: string;
    tags?: ITag[];
    versions?: IHelpCenterArticleVersion[];
}
/**
 * Article version
 * This is used to track changes to articles over time
 */
export interface IHelpCenterArticleVersion extends IBasePerTenantAndOrganizationEntityModel {
    articleId: ID;
    article?: IHelpCenterArticle;
    ownedById?: ID;
    ownedBy?: IEmployee;
    lastSavedAt: Date;
    descriptionHtml?: string;
    descriptionJson?: JsonData;
    descriptionBinary?: Uint8Array;
}
export interface IHelpCenterAuthor extends IBasePerTenantAndOrganizationEntityModel {
    articleId: string;
    article?: IHelpCenterArticle;
    employeeId: string;
    employee?: IEmployee;
    articles?: IHelpCenterArticle[];
}
export interface IHelpCenterAuthorCreate extends IBasePerTenantAndOrganizationEntityModel {
    articleId: string;
    employeeIds: string[];
}
export interface IHelpCenterAuthorFind extends IBasePerTenantAndOrganizationEntityModel {
    id?: string;
}
export interface IHelpCenterArticleUpdate extends Partial<IHelpCenterArticle> {
}
export interface IHelpCenterArticleAdvancedFilter extends IBaseRelationsEntityModel {
    ids?: ID[];
    names?: string[];
    tags?: ID[];
    projects?: ID[];
    categories?: ID[];
    authors?: ID[];
    ownedBy?: ID[];
    draft?: boolean;
    privacy?: boolean;
    isLocked?: boolean;
}
export interface IHelpCenterArticleFiltering {
    filters?: IHelpCenterArticleAdvancedFilter;
}
