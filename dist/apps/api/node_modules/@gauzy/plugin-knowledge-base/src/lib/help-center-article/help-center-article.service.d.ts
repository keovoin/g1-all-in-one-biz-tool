import { Request } from 'express';
import { DeepPartial, DeleteResult } from 'typeorm';
import { TenantAwareCrudService, BaseQueryDTO } from '@gauzy/core';
import { ID, IHelpCenterArticle, IHelpCenterArticleUpdate, IHelpCenterArticleVersion, IHelpCenterArticleFiltering, IPagination } from '@gauzy/contracts';
import { HelpCenterArticle } from './help-center-article.entity';
import { HelpCenterArticleVersionService } from './help-center-article-version.service';
import { TypeOrmHelpCenterArticleRepository } from './repository/type-orm-help-center-article.repository';
import { MikroOrmHelpCenterArticleRepository } from './repository/mikro-orm-help-center-article.repository';
/**
 * Columns a caller may sort help-center articles by.
 *
 * The MikroORM/Knex branch interpolates the order key into the query instead of resolving it
 * through entity metadata, so the accepted keys must be enumerated explicitly.
 */
export declare const HELP_CENTER_ARTICLE_SORTABLE_FIELDS: readonly ["name", "index", "draft", "privacy", "isLocked", "color", "categoryId", "createdAt", "updatedAt"];
export declare class HelpCenterArticleService extends TenantAwareCrudService<HelpCenterArticle> {
    readonly typeOrmHelpCenterArticleRepository: TypeOrmHelpCenterArticleRepository;
    readonly mikroOrmHelpCenterArticleRepository: MikroOrmHelpCenterArticleRepository;
    private readonly versionService;
    constructor(typeOrmHelpCenterArticleRepository: TypeOrmHelpCenterArticleRepository, mikroOrmHelpCenterArticleRepository: MikroOrmHelpCenterArticleRepository, versionService: HelpCenterArticleVersionService);
    /**
     * Creates a Help Center article, sanitizing the legacy rich-text `data` HTML column through
     * the shared server-side allowlist before persisting — the column is re-rendered with
     * `[innerHTML]` in the Help Center reader (see `sanitizeRichHtml`).
     *
     * @param entity - The article data to persist.
     * @returns The persisted article.
     */
    create(entity: DeepPartial<HelpCenterArticle>): Promise<HelpCenterArticle>;
    /**
     * Get every article in a category, sanitizing the legacy rich-text `data` column on the way out.
     *
     * 🛑 Sanitizing on write is not enough here. `data` is a CKEditor-4 era corpus: every row written
     * before `sanitizeRichHtml` shipped went to disk unfiltered, and those rows are re-rendered with
     * `[innerHtml]` in the Help Center reader. So the read path re-runs the same allowlist and, when a
     * row actually changes, lazily re-saves the clean HTML so the corpus heals one read at a time.
     * The allowlist is idempotent, so already-clean rows compare equal and are never re-written.
     *
     * @param categoryId - The category whose articles to load.
     * @returns The articles, with `data` guaranteed to have passed the allowlist.
     */
    getArticlesByCategoryId(categoryId: ID): Promise<HelpCenterArticle[]>;
    /**
     * Re-run the shared rich-text allowlist over each article's legacy `data` column and lazily
     * persist the cleaned HTML for the rows that were not already clean.
     *
     * The re-save is best-effort: a failure to heal the stored row must never fail the read, because
     * the value handed back to the caller is already sanitized either way.
     *
     * @param articles - The articles to sanitize in place.
     * @returns The same array, with sanitized `data`.
     */
    private sanitizeArticlesData;
    /**
     * Get articles by project ID with pagination and advanced filtering.
     *
     * @param projectId - The project ID to filter by.
     * @param options - The pagination and filtering options.
     * @returns A promise that resolves with the paginated articles and total count.
     */
    getArticlesByProjectId(projectId: ID, options: BaseQueryDTO<HelpCenterArticle> & IHelpCenterArticleFiltering): Promise<IPagination<IHelpCenterArticle>>;
    /**
     * Delete articles by IDs.
     */
    deleteBulkByArticleIds(ids: ID[]): Promise<DeleteResult | never[]>;
    /**
     * Update an article by ID.
     */
    updateArticleById(id: ID, input: IHelpCenterArticleUpdate): Promise<void>;
    /**
     * Update an article with automatic version snapshot.
     * Creates a version snapshot of the current state before applying the update.
     *
     * Note: This operation is NON-ATOMIC. If the update fails after version creation,
     * an orphan version record may remain. This data-integrity risk is tracked
     * under issue ID: GAU-9421.
     *
     * @param id - Article ID
     * @param input - Partial update data (any field including isLocked, archivedAt, privacy, etc.)
     * @param ownedById - Employee ID making the change
     */
    updateWithVersioning(id: ID, input: IHelpCenterArticleUpdate, ownedById?: ID): Promise<{
        article: IHelpCenterArticle;
        version: IHelpCenterArticleVersion;
    }>;
    /**
     * Get the raw binary description of an article as a Buffer.
     *
     * Uses QueryBuilder directly to avoid TypeORM DISTINCT subquery issues
     * when `select: { descriptionBinary: true }` omits the 'id' column.
     * Scoped to the current tenant to prevent cross-tenant data access.
     *
     * @returns Buffer if binary exists, null otherwise
     */
    getDescriptionBinary(id: ID): Promise<Buffer | null>;
    /**
     * Atomic update of description fields using QueryBuilder directly.
     *
     * This bypasses the CrudService.update() → TypeORM Repository.update() chain
     * because TypeORM's QueryDeepPartialEntity typing silently drops Buffer values
     * for entity fields typed as Uint8Array, preventing binary data from being persisted
     * to PostgreSQL bytea columns.
     *
     * Scoped to the current tenant to prevent cross-tenant data modification.
     *
     * @param id - Article ID
     * @param fields - Object with descriptionBinary (Buffer | null to clear), descriptionHtml, descriptionJson
     */
    updateDescriptionFields(id: ID, fields: {
        descriptionBinary?: Buffer | null;
        descriptionHtml?: string;
        descriptionJson?: string;
    }): Promise<void>;
    /**
     * Duplicate an article.
     */
    duplicate(id: ID): Promise<HelpCenterArticle>;
    /**
     * Constructs advanced `where` conditions for filtering articles based on the provided filters and existing conditions.
     *
     * @private
     * @param {IHelpCenterArticleAdvancedFilter} [filters] - Advanced filtering criteria for articles.
     * @param {FindOptionsWhere<HelpCenterArticle>} [where] - Existing `where` conditions to be merged with the filters.
     * @returns {FindOptionsWhere<HelpCenterArticle>} A `where` condition object to be used in database queries.
     */
    private buildAdvancedWhereCondition;
    /**
     * Read and validate a raw binary stream from an HTTP request.
     * Rejects payloads that exceed HELP_CENTER_ARTICLE_MAX_BINARY_BYTES via:
     *   1. A fast Content-Length pre-check (before any data is buffered).
     *   2. A byte counter during streaming (catches chunked / lying clients).
     *
     * @param req - The Express request carrying the raw octet-stream body.
     * @returns The fully buffered binary payload as a Buffer.
     */
    readBinaryStream(req: Request): Promise<Buffer>;
}
