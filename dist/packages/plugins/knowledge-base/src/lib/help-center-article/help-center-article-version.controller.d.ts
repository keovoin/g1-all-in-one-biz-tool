import { DeepPartial, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ID, IHelpCenterArticle, IHelpCenterArticleVersion, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '@gauzy/core';
import { HelpCenterArticleVersion } from './help-center-article-version.entity';
import { HelpCenterArticleVersionService } from './help-center-article-version.service';
/**
 * Controller for HelpCenterArticleVersion.
 *
 * Versions are created automatically when articles are updated via updateWithVersioning().
 * This controller provides read-only access + restore functionality.
 */
export declare class HelpCenterArticleVersionController extends CrudController<HelpCenterArticleVersion> {
    private readonly articleVersionService;
    constructor(articleVersionService: HelpCenterArticleVersionService);
    /**
     * Get all versions (with optional filtering by articleId)
     * Usage: GET /?where[articleId]=xxx&order[lastSavedAt]=DESC
     */
    findAll(options: BaseQueryDTO<HelpCenterArticleVersion>): Promise<IPagination<HelpCenterArticleVersion>>;
    /**
     * Get a specific version by ID
     */
    findById(id: ID, options: BaseQueryDTO<HelpCenterArticleVersion>): Promise<IHelpCenterArticleVersion>;
    /**
     * Restore an article to a specific version's content.
     * Copies the version's descriptionHtml/Json back to the article.
     */
    restoreVersion(versionId: ID): Promise<IHelpCenterArticle | UpdateResult>;
    /**
     * CREATE an article version row
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    create(entity: DeepPartial<HelpCenterArticleVersion>): Promise<HelpCenterArticleVersion>;
    /**
     * UPDATE an article version row by id
     *
     * Overrides the inherited `CrudController.update()` route only to attach the permission gate.
     * A stored version is what `POST :id/restore` copies back into the article, so rewriting one is
     * a write to the article's content by another name.
     */
    update(id: ID, entity: QueryDeepPartialEntity<HelpCenterArticleVersion>): Promise<any>;
    /**
     * DELETE an article version row by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    delete(id: ID): Promise<any>;
    /**
     * SOFT DELETE an article version row by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    softRemove(id: ID, ...options: any[]): Promise<HelpCenterArticleVersion>;
    /**
     * RESTORE a soft-deleted article version row by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    softRecover(id: ID, ...options: any[]): Promise<HelpCenterArticleVersion>;
}
