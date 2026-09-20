"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHelpCenterArticleDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
const help_center_article_entity_1 = require("../help-center-article.entity");
/**
 * Create HelpCenterArticle data validation request DTO
 * Inherits validations from the entity, omits relation objects (only IDs needed)
 */
class CreateHelpCenterArticleDTO extends (0, swagger_1.IntersectionType)(core_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(help_center_article_entity_1.HelpCenterArticle, [
    'children',
    'authors',
    'versions'
])) {
}
exports.CreateHelpCenterArticleDTO = CreateHelpCenterArticleDTO;
//# sourceMappingURL=create-help-center-article.dto.js.map