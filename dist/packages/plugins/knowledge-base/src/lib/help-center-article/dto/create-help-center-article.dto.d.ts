import { IHelpCenterArticle } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
import { HelpCenterArticle } from '../help-center-article.entity';
declare const CreateHelpCenterArticleDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<HelpCenterArticle, "children" | "authors" | "versions">>;
/**
 * Create HelpCenterArticle data validation request DTO
 * Inherits validations from the entity, omits relation objects (only IDs needed)
 */
export declare class CreateHelpCenterArticleDTO extends CreateHelpCenterArticleDTO_base implements Partial<IHelpCenterArticle> {
}
export {};
