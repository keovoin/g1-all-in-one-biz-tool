"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHelpCenterArticleDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_help_center_article_dto_1 = require("./create-help-center-article.dto");
/**
 * Update HelpCenterArticle data validation request DTO
 * All fields are optional
 */
class UpdateHelpCenterArticleDTO extends (0, swagger_1.PartialType)(create_help_center_article_dto_1.CreateHelpCenterArticleDTO) {
}
exports.UpdateHelpCenterArticleDTO = UpdateHelpCenterArticleDTO;
//# sourceMappingURL=update-help-center-article.dto.js.map