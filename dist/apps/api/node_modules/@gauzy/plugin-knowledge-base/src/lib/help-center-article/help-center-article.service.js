"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleService = exports.HELP_CENTER_ARTICLE_SORTABLE_FIELDS = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("@gauzy/constants");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
const help_center_article_version_service_1 = require("./help-center-article-version.service");
const type_orm_help_center_article_repository_1 = require("./repository/type-orm-help-center-article.repository");
const mikro_orm_help_center_article_repository_1 = require("./repository/mikro-orm-help-center-article.repository");
/**
 * Columns a caller may sort help-center articles by.
 *
 * The MikroORM/Knex branch interpolates the order key into the query instead of resolving it
 * through entity metadata, so the accepted keys must be enumerated explicitly.
 */
exports.HELP_CENTER_ARTICLE_SORTABLE_FIELDS = [
    'name',
    'index',
    'draft',
    'privacy',
    'isLocked',
    'color',
    'categoryId',
    'createdAt',
    'updatedAt'
];
let HelpCenterArticleService = class HelpCenterArticleService extends core_1.TenantAwareCrudService {
    constructor(typeOrmHelpCenterArticleRepository, mikroOrmHelpCenterArticleRepository, versionService) {
        super(typeOrmHelpCenterArticleRepository, mikroOrmHelpCenterArticleRepository);
        this.typeOrmHelpCenterArticleRepository = typeOrmHelpCenterArticleRepository;
        this.mikroOrmHelpCenterArticleRepository = mikroOrmHelpCenterArticleRepository;
        this.versionService = versionService;
    }
    /**
     * Creates a Help Center article, sanitizing the legacy rich-text `data` HTML column through
     * the shared server-side allowlist before persisting — the column is re-rendered with
     * `[innerHTML]` in the Help Center reader (see `sanitizeRichHtml`).
     *
     * @param entity - The article data to persist.
     * @returns The persisted article.
     */
    async create(entity) {
        if (typeof entity.data === 'string') {
            entity.data = (0, core_1.sanitizeRichHtml)(entity.data);
        }
        return await super.create(entity);
    }
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
    async getArticlesByCategoryId(categoryId) {
        const articles = await this.find({
            where: { categoryId }
        });
        return await this.sanitizeArticlesData(articles);
    }
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
    async sanitizeArticlesData(articles) {
        const healed = [];
        for (const article of articles) {
            if (typeof article.data !== 'string' || !article.data) {
                continue;
            }
            const sanitized = (0, core_1.sanitizeRichHtml)(article.data);
            if (sanitized !== article.data) {
                article.data = sanitized;
                healed.push(article.id);
            }
        }
        // Lazily heal the stored corpus — never let this break the read.
        await Promise.all(healed.map(async (id) => {
            const article = articles.find((a) => a.id === id);
            try {
                await this.typeOrmHelpCenterArticleRepository.update(id, { data: article.data });
            }
            catch (error) {
                console.error(`Failed to persist sanitized Help Center article data for id ${id}`, error);
            }
        }));
        return articles;
    }
    /**
     * Get articles by project ID with pagination and advanced filtering.
     *
     * @param projectId - The project ID to filter by.
     * @param options - The pagination and filtering options.
     * @returns A promise that resolves with the paginated articles and total count.
     */
    async getArticlesByProjectId(projectId, options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            const { where, filters } = options;
            const { organizationId } = where;
            const tenantId = core_1.RequestContext.currentTenantId() ?? where.tenantId;
            switch (this.ormType) {
                case core_1.MultiORMEnum.MikroORM: {
                    // MikroORM: Use Knex for junction-table subquery filtering
                    const knex = this.mikroOrmRepository.getKnex();
                    // Build base query on the knowledge_base_article table
                    let qb = knex('knowledge_base_article as kba')
                        .whereIn('kba.id', function () {
                        this.select('knowledgeBaseArticleId')
                            .from('knowledge_base_article_project')
                            .where('organizationProjectId', projectId);
                    })
                        .andWhere('kba.organizationId', organizationId)
                        .andWhere('kba.tenantId', tenantId);
                    // Apply additional where filters
                    if ((0, utils_1.isNotEmpty)(where)) {
                        const { name, draft, privacy, isLocked, categoryId } = where;
                        if ((0, utils_1.isNotEmpty)(name))
                            qb = qb.andWhere('kba.name', 'ILIKE', `%${name}%`);
                        if (draft !== undefined)
                            qb = qb.andWhere('kba.draft', draft);
                        if (privacy !== undefined)
                            qb = qb.andWhere('kba.privacy', privacy);
                        if (isLocked !== undefined)
                            qb = qb.andWhere('kba.isLocked', isLocked);
                        if ((0, utils_1.isNotEmpty)(categoryId))
                            qb = qb.andWhere('kba.categoryId', categoryId);
                    }
                    // Apply advanced filters
                    if (filters) {
                        const { ids = [], names = [], categories = [], ownedBy = [], draft: advDraft, privacy: advPrivacy, isLocked: advIsLocked } = filters;
                        if (ids.length)
                            qb = qb.whereIn('kba.id', ids);
                        if (names.length)
                            qb = qb.whereIn('kba.name', names);
                        if (categories.length)
                            qb = qb.whereIn('kba.categoryId', categories);
                        if (ownedBy.length)
                            qb = qb.whereIn('kba.ownedById', ownedBy);
                        if (advDraft !== undefined)
                            qb = qb.andWhere('kba.draft', advDraft);
                        if (advPrivacy !== undefined)
                            qb = qb.andWhere('kba.privacy', advPrivacy);
                        if (advIsLocked !== undefined)
                            qb = qb.andWhere('kba.isLocked', advIsLocked);
                    }
                    // Apply ordering.
                    //
                    // `options.order` comes straight from the request (BaseQueryDTO validates only that
                    // it is present), and both the column and the direction are interpolated into the
                    // query here rather than mapped through entity metadata. Clamp each against an
                    // explicit allowlist so a request can never place arbitrary text in the ORDER BY
                    // position — the same defense applied to the plugin marketplace search
                    // (GHSA-xqcf-j9jr-7w59).
                    if (options.order) {
                        for (const [key, direction] of Object.entries(options.order)) {
                            if (!exports.HELP_CENTER_ARTICLE_SORTABLE_FIELDS.includes(key)) {
                                continue;
                            }
                            const normalized = String(direction).toUpperCase() === 'ASC' ? 'asc' : 'desc';
                            qb = qb.orderBy(`kba.${key}`, normalized);
                        }
                    }
                    // Count total before applying pagination
                    const countResult = await qb.clone().clearSelect().clearOrder().count('* as count').first();
                    const total = parseInt(countResult?.count ?? '0', 10);
                    // Apply pagination
                    if (options.take)
                        qb = qb.limit(options.take);
                    if (options.skip)
                        qb = qb.offset(options.skip);
                    const rawItems = await qb.select('kba.*');
                    // Map raw results to entities
                    const items = rawItems.map((row) => this.mikroOrmRepository.map(row));
                    return { items, total };
                }
                case core_1.MultiORMEnum.TypeORM:
                default: {
                    // TypeORM: Original createQueryBuilder implementation
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.leftJoin(`${query.alias}.projects`, 'projects');
                    // Apply find options if provided
                    if ((0, utils_1.isNotEmpty)(options)) {
                        query.setFindOptions({
                            ...(options.select && { select: (0, core_1.parseFindOptionsSelect)(options.select) }),
                            ...(options.relations && { relations: (0, core_1.parseFindOptionsRelations)(options.relations) }),
                            ...(options.order && { order: options.order }),
                            ...(options.take && { take: options.take }),
                            ...(options.skip && { skip: options.skip })
                        });
                    }
                    // Apply advanced filters
                    if (filters) {
                        const advancedWhere = this.buildAdvancedWhereCondition(filters, where);
                        query.setFindOptions({ where: advancedWhere });
                    }
                    // Filter by knowledge_base_article_project with a sub query
                    query.andWhere((qb) => {
                        const subQuery = qb
                            .subQuery()
                            .select((0, core_1.prepareSQLQuery)('"kbap"."knowledgeBaseArticleId"'))
                            .from((0, core_1.prepareSQLQuery)('knowledge_base_article_project'), 'kbap')
                            .andWhere((0, core_1.prepareSQLQuery)('"kbap"."organizationProjectId" = :projectId'), { projectId });
                        return ((0, core_1.prepareSQLQuery)(`"knowledge_base_article_projects"."knowledgeBaseArticleId" IN `) +
                            subQuery.distinct(true).getQuery());
                    });
                    // Add organization and tenant filters
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, core_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        qb.andWhere((0, core_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    // Add additional filters (draft, privacy, names, etc.)
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        if ((0, utils_1.isNotEmpty)(where)) {
                            const { name, draft, privacy, isLocked, categoryId } = where;
                            if ((0, utils_1.isNotEmpty)(name)) {
                                qb.andWhere((0, core_1.prepareSQLQuery)(`"${query.alias}"."name" ${core_1.LIKE_OPERATOR} :name`), {
                                    name: `%${name}%`
                                });
                            }
                            if (draft !== undefined) {
                                qb.andWhere((0, core_1.prepareSQLQuery)(`"${query.alias}"."draft" = :draft`), { draft });
                            }
                            if (privacy !== undefined) {
                                qb.andWhere((0, core_1.prepareSQLQuery)(`"${query.alias}"."privacy" = :privacy`), { privacy });
                            }
                            if (isLocked !== undefined) {
                                qb.andWhere((0, core_1.prepareSQLQuery)(`"${query.alias}"."isLocked" = :isLocked`), { isLocked });
                            }
                            if ((0, utils_1.isNotEmpty)(categoryId)) {
                                qb.andWhere((0, core_1.prepareSQLQuery)(`"${query.alias}"."categoryId" = :categoryId`), { categoryId });
                            }
                        }
                    }));
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Delete articles by IDs.
     */
    async deleteBulkByArticleIds(ids) {
        if ((0, utils_1.isNotEmpty)(ids)) {
            return await this.delete({ id: (0, typeorm_1.In)(ids) });
        }
        return [];
    }
    /**
     * Update an article by ID.
     */
    async updateArticleById(id, input) {
        // Sanitize the legacy rich-text `data` HTML column through the shared server-side allowlist.
        if (typeof input.data === 'string') {
            input.data = (0, core_1.sanitizeRichHtml)(input.data);
        }
        await super.update(id, input);
    }
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
    async updateWithVersioning(id, input, ownedById) {
        // Sanitize the legacy rich-text `data` HTML column through the shared server-side allowlist.
        if (typeof input.data === 'string') {
            input.data = (0, core_1.sanitizeRichHtml)(input.data);
        }
        // 1. Get current article state
        const { record: currentArticle } = await this.findOneOrFailByIdString(id);
        // 2. Create version snapshot of current state (before update) — include binary
        const versionInput = {
            articleId: id,
            ownedById,
            descriptionHtml: currentArticle.descriptionHtml,
            descriptionJson: currentArticle.descriptionJson,
            descriptionBinary: currentArticle.descriptionBinary,
            lastSavedAt: new Date()
        };
        const version = await this.versionService.create(versionInput);
        // 3. Apply update
        await super.update(id, input);
        // 4. Return updated article and version
        const { record: updatedArticle } = await this.findOneOrFailByIdString(id);
        return { article: updatedArticle, version };
    }
    /**
     * Get the raw binary description of an article as a Buffer.
     *
     * Uses QueryBuilder directly to avoid TypeORM DISTINCT subquery issues
     * when `select: { descriptionBinary: true }` omits the 'id' column.
     * Scoped to the current tenant to prevent cross-tenant data access.
     *
     * @returns Buffer if binary exists, null otherwise
     */
    async getDescriptionBinary(id) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const qb = this.typeOrmHelpCenterArticleRepository
            .createQueryBuilder('article')
            .select(['article.id', 'article.descriptionBinary'])
            .where('article.id = :id', { id });
        if (tenantId) {
            qb.andWhere('article.tenantId = :tenantId', { tenantId });
        }
        const article = await qb.getOne();
        return article?.descriptionBinary ? Buffer.from(article.descriptionBinary) : null;
    }
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
    async updateDescriptionFields(id, fields) {
        const setClauses = {};
        if (fields.descriptionBinary !== undefined) {
            setClauses.descriptionBinary = fields.descriptionBinary;
        }
        if (fields.descriptionHtml !== undefined) {
            setClauses.descriptionHtml = fields.descriptionHtml;
        }
        if (fields.descriptionJson !== undefined) {
            setClauses.descriptionJson = fields.descriptionJson;
        }
        if (Object.keys(setClauses).length === 0) {
            return;
        }
        const tenantId = core_1.RequestContext.currentTenantId();
        const qb = this.typeOrmHelpCenterArticleRepository
            .createQueryBuilder()
            .update()
            .set(setClauses)
            .where('id = :id', { id });
        if (tenantId) {
            qb.andWhere('"tenantId" = :tenantId', { tenantId });
        }
        await qb.execute();
    }
    /**
     * Duplicate an article.
     */
    async duplicate(id) {
        const ownedById = core_1.RequestContext.currentEmployeeId();
        // Load the source with its M2M relations so we can copy them
        const { record: source } = await this.findOneOrFailByIdString(id, {
            relations: { projects: true, tags: true }
        });
        const copy = {
            name: `${source.name} (Copy)`,
            description: source.description,
            data: source.data,
            draft: source.draft,
            privacy: source.privacy,
            index: source.index,
            descriptionHtml: source.descriptionHtml,
            descriptionJson: source.descriptionJson,
            descriptionBinary: null,
            isLocked: false,
            color: source.color,
            categoryId: source.categoryId,
            parentId: source.parentId,
            ownedById: ownedById ?? source.ownedById,
            organizationId: source.organizationId,
            externalId: null,
            projects: source.projects ?? [],
            tags: source.tags ?? []
        };
        return await this.create(copy);
    }
    /**
     * Constructs advanced `where` conditions for filtering articles based on the provided filters and existing conditions.
     *
     * @private
     * @param {IHelpCenterArticleAdvancedFilter} [filters] - Advanced filtering criteria for articles.
     * @param {FindOptionsWhere<HelpCenterArticle>} [where] - Existing `where` conditions to be merged with the filters.
     * @returns {FindOptionsWhere<HelpCenterArticle>} A `where` condition object to be used in database queries.
     */
    buildAdvancedWhereCondition(filters, where = {}) {
        const { ids = [], names = [], tags = [], projects = [], categories = [], authors = [], ownedBy = [], draft, privacy, isLocked } = filters;
        return {
            ...(ids.length && !where.id ? { id: (0, typeorm_1.In)(ids) } : {}),
            ...(names.length && !where.name ? { name: (0, typeorm_1.In)(names) } : {}),
            ...(tags.length && !where.tags ? { tags: { id: (0, typeorm_1.In)(tags) } } : {}),
            ...(projects.length && !where.projects ? { projects: { id: (0, typeorm_1.In)(projects) } } : {}),
            ...(categories.length && !where.categoryId ? { categoryId: (0, typeorm_1.In)(categories) } : {}),
            ...(authors.length && !where.authors ? { authors: { employeeId: (0, typeorm_1.In)(authors) } } : {}),
            ...(ownedBy.length && !where.ownedById ? { ownedById: (0, typeorm_1.In)(ownedBy) } : {}),
            ...(draft !== undefined && where.draft === undefined ? { draft } : {}),
            ...(privacy !== undefined && where.privacy === undefined ? { privacy } : {}),
            ...(isLocked !== undefined && where.isLocked === undefined ? { isLocked } : {})
        };
    }
    /**
     * Read and validate a raw binary stream from an HTTP request.
     * Rejects payloads that exceed HELP_CENTER_ARTICLE_MAX_BINARY_BYTES via:
     *   1. A fast Content-Length pre-check (before any data is buffered).
     *   2. A byte counter during streaming (catches chunked / lying clients).
     *
     * @param req - The Express request carrying the raw octet-stream body.
     * @returns The fully buffered binary payload as a Buffer.
     */
    async readBinaryStream(req) {
        // 1. Fast pre-check — only when the header is actually present to avoid masking its absence.
        const rawContentLength = req.headers['content-length'];
        if (rawContentLength !== undefined) {
            const contentLength = parseInt(rawContentLength, 10);
            if (!isNaN(contentLength) && contentLength > constants_1.HELP_CENTER_ARTICLE_MAX_BINARY_BYTES) {
                throw new common_1.PayloadTooLargeException(`Payload exceeds the maximum allowed size of ${constants_1.HELP_CENTER_ARTICLE_MAX_BINARY_BYTES} bytes.`);
            }
        }
        // 2. Buffer the stream, counting bytes to catch chunked or lying clients.
        let chunks = [];
        let bytesReceived = 0;
        await new Promise((resolve, reject) => {
            req.on('data', (chunk) => {
                bytesReceived += chunk.length;
                if (bytesReceived > constants_1.HELP_CENTER_ARTICLE_MAX_BINARY_BYTES) {
                    const err = new common_1.PayloadTooLargeException(`Payload exceeds the maximum allowed size of ${constants_1.HELP_CENTER_ARTICLE_MAX_BINARY_BYTES} bytes.`);
                    // Destroy the stream immediately to stop further data events and free resources.
                    req.destroy(err);
                    reject(err);
                    return;
                }
                chunks.push(chunk);
            });
            req.once('end', resolve);
            req.once('error', reject);
            // Handles premature client disconnect — prevents the Promise from hanging forever.
            req.once('close', () => {
                if (!req.complete) {
                    reject(new common_1.BadRequestException('Request was aborted before upload completed.'));
                }
            });
        });
        return Buffer.concat(chunks);
    }
};
exports.HelpCenterArticleService = HelpCenterArticleService;
exports.HelpCenterArticleService = HelpCenterArticleService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_help_center_article_repository_1.TypeOrmHelpCenterArticleRepository,
        mikro_orm_help_center_article_repository_1.MikroOrmHelpCenterArticleRepository,
        help_center_article_version_service_1.HelpCenterArticleVersionService])
], HelpCenterArticleService);
//# sourceMappingURL=help-center-article.service.js.map