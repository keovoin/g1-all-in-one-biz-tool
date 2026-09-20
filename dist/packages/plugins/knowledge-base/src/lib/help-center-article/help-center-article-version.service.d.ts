import { UpdateResult } from 'typeorm';
import { TenantAwareCrudService } from '@gauzy/core';
import { ID, IHelpCenterArticle } from '@gauzy/contracts';
import { HelpCenterArticleVersion } from './help-center-article-version.entity';
import { HelpCenterArticleService } from './help-center-article.service';
import { TypeOrmHelpCenterArticleVersionRepository } from './repository/type-orm-help-center-article-version.repository';
import { MikroOrmHelpCenterArticleVersionRepository } from './repository/mikro-orm-help-center-article-version.repository';
/**
 * Service for managing HelpCenterArticle versions.
 * Inherits all CRUD operations from TenantAwareCrudService.
 */
export declare class HelpCenterArticleVersionService extends TenantAwareCrudService<HelpCenterArticleVersion> {
    readonly typeOrmHelpCenterArticleVersionRepository: TypeOrmHelpCenterArticleVersionRepository;
    readonly mikroOrmHelpCenterArticleVersionRepository: MikroOrmHelpCenterArticleVersionRepository;
    private readonly articleService;
    constructor(typeOrmHelpCenterArticleVersionRepository: TypeOrmHelpCenterArticleVersionRepository, mikroOrmHelpCenterArticleVersionRepository: MikroOrmHelpCenterArticleVersionRepository, articleService: HelpCenterArticleService);
    /**
     * Restore an article to a specific version's content.
     * First creates a snapshot of the current article state to preserve it,
     * then copies the version's descriptionHtml/Json back to the article.
     *
     * @param versionId - The version ID to restore from
     * @returns The updated article
     */
    restoreToVersion(versionId: ID): Promise<IHelpCenterArticle | UpdateResult>;
}
