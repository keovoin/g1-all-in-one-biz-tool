import { IHelpCenterArticleUpdate } from '@gauzy/contracts';
import { CreateHelpCenterArticleDTO } from './create-help-center-article.dto';
declare const UpdateHelpCenterArticleDTO_base: import("@nestjs/common").Type<Partial<CreateHelpCenterArticleDTO>>;
/**
 * Update HelpCenterArticle data validation request DTO
 * All fields are optional
 */
export declare class UpdateHelpCenterArticleDTO extends UpdateHelpCenterArticleDTO_base implements IHelpCenterArticleUpdate {
}
export {};
