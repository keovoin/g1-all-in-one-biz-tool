"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleVersionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const help_center_article_service_1 = require("./help-center-article.service");
const type_orm_help_center_article_version_repository_1 = require("./repository/type-orm-help-center-article-version.repository");
const mikro_orm_help_center_article_version_repository_1 = require("./repository/mikro-orm-help-center-article-version.repository");
/**
 * Service for managing HelpCenterArticle versions.
 * Inherits all CRUD operations from TenantAwareCrudService.
 */
let HelpCenterArticleVersionService = class HelpCenterArticleVersionService extends core_1.TenantAwareCrudService {
    constructor(typeOrmHelpCenterArticleVersionRepository, mikroOrmHelpCenterArticleVersionRepository, articleService) {
        super(typeOrmHelpCenterArticleVersionRepository, mikroOrmHelpCenterArticleVersionRepository);
        this.typeOrmHelpCenterArticleVersionRepository = typeOrmHelpCenterArticleVersionRepository;
        this.mikroOrmHelpCenterArticleVersionRepository = mikroOrmHelpCenterArticleVersionRepository;
        this.articleService = articleService;
    }
    /**
     * Restore an article to a specific version's content.
     * First creates a snapshot of the current article state to preserve it,
     * then copies the version's descriptionHtml/Json back to the article.
     *
     * @param versionId - The version ID to restore from
     * @returns The updated article
     */
    async restoreToVersion(versionId) {
        // 1. Get the version to restore
        const { record: version } = await this.findOneOrFailByIdString(versionId);
        // 2. Get current article state before overwriting
        const { record: currentArticle } = await this.articleService.findOneOrFailByIdString(version.articleId);
        // 3. Get current user's employee ID for version ownership
        const employeeId = core_1.RequestContext.currentEmployeeId() || core_1.RequestContext.currentUser()?.employeeId;
        // 4. Create a snapshot of the current state before restoring
        const snapshotInput = {
            articleId: version.articleId,
            ownedById: employeeId,
            descriptionHtml: currentArticle.descriptionHtml,
            descriptionJson: currentArticle.descriptionJson,
            descriptionBinary: currentArticle.descriptionBinary,
            lastSavedAt: new Date()
        };
        await this.create(snapshotInput);
        // 5. Update the article with the version's content (including binary)
        return await this.articleService.update(version.articleId, {
            descriptionHtml: version.descriptionHtml,
            descriptionJson: version.descriptionJson,
            descriptionBinary: version.descriptionBinary
        });
    }
};
exports.HelpCenterArticleVersionService = HelpCenterArticleVersionService;
exports.HelpCenterArticleVersionService = HelpCenterArticleVersionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => help_center_article_service_1.HelpCenterArticleService))),
    tslib_1.__metadata("design:paramtypes", [type_orm_help_center_article_version_repository_1.TypeOrmHelpCenterArticleVersionRepository,
        mikro_orm_help_center_article_version_repository_1.MikroOrmHelpCenterArticleVersionRepository,
        help_center_article_service_1.HelpCenterArticleService])
], HelpCenterArticleVersionService);
//# sourceMappingURL=help-center-article-version.service.js.map