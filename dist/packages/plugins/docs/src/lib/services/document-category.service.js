"use strict";
var DocumentCategoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const docs_constants_1 = require("../docs.constants");
const mikro_orm_document_category_repository_1 = require("../repositories/mikro-orm-document-category.repository");
const type_orm_document_category_repository_1 = require("../repositories/type-orm-document-category.repository");
let DocumentCategoryService = DocumentCategoryService_1 = class DocumentCategoryService extends core_1.TenantAwareCrudService {
    constructor(typeOrmDocumentCategoryRepository, mikroOrmDocumentCategoryRepository) {
        super(typeOrmDocumentCategoryRepository, mikroOrmDocumentCategoryRepository);
        this.typeOrmDocumentCategoryRepository = typeOrmDocumentCategoryRepository;
        this.mikroOrmDocumentCategoryRepository = mikroOrmDocumentCategoryRepository;
        this.logger = new common_1.Logger(DocumentCategoryService_1.name);
    }
    /**
     * Lists the per-tenant/org category catalog, sorted by name, each item carrying
     * `documentCount`.
     *
     * @param params Pagination + org scope.
     * @returns The catalog page.
     */
    async getCategories(params) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = params?.organizationId ?? params?.where?.organizationId;
        const qb = this.typeOrmRepository.createQueryBuilder('category');
        qb.where((0, core_1.prepareSQLQuery)(`"category"."tenantId" = :tenantId`), { tenantId });
        if (organizationId) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"category"."organizationId" = :organizationId`), { organizationId });
        }
        qb.addSelect((0, core_1.prepareSQLQuery)(`(SELECT COUNT(*) FROM "document_category_document" "dcd" WHERE "dcd"."documentCategoryId" = "category"."id")`), 'category_documentCount');
        qb.orderBy('category.name', 'ASC');
        if (params?.take) {
            qb.take(params.take);
            if (params?.skip) {
                qb.skip(params.take * (params.skip - 1));
            }
        }
        const total = await qb.getCount();
        const { entities, raw } = await qb.getRawAndEntities();
        const items = entities.map((entity, index) => {
            entity.documentCount = Number(raw[index]?.['category_documentCount']) || 0;
            return entity;
        });
        return { items, total };
    }
    /**
     * Creates a catalog entry. Names are unique per organization (case-insensitive);
     * duplicates raise 409 `DOCS_CATEGORY_EXISTS`. The slug is auto-derived when absent.
     *
     * @param input The create payload.
     * @returns The created category.
     */
    async createCategory(input) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const { organizationId } = input;
        const slug = input.slug ?? this.slugify(input.name);
        await this.assertUnique(input.name, slug, tenantId, organizationId);
        return this.create({
            ...input,
            slug,
            isSystem: false
        });
    }
    /**
     * Updates a catalog entry. `isSystem` rows may be renamed/recolored but their `slug` is
     * immutable.
     *
     * @param id The category id.
     * @param input The update payload.
     * @returns The updated category.
     */
    async updateCategory(id, input) {
        const category = await this.findOneByIdString(id);
        const slug = this.resolveUpdatedSlug(category, input);
        if (input.name && input.name.toLowerCase() !== category.name.toLowerCase()) {
            await this.assertUnique(input.name, slug !== category.slug ? slug : undefined, category.tenantId, category.organizationId);
        }
        return this.save({
            ...category,
            ...input,
            slug,
            id: category.id,
            isSystem: category.isSystem
        });
    }
    /**
     * Deletes a catalog entry. `isSystem: true` rows raise 409 `DOCS_CATEGORY_SYSTEM`; in-use
     * categories are detached from documents (pivot rows removed), then soft-deleted.
     *
     * @param id The category id.
     * @returns The soft-deleted category.
     */
    async deleteCategory(id) {
        const category = await this.findOneByIdString(id);
        if (category.isSystem) {
            throw new common_1.ConflictException({ message: 'System categories cannot be deleted', code: docs_constants_1.DOCS_CATEGORY_SYSTEM });
        }
        // Detach from all documents (pivot rows only, never documents)
        await this.typeOrmRepository.manager
            .createQueryBuilder()
            .delete()
            .from('document_category_document')
            .where('"documentCategoryId" = :id', { id: category.id })
            .execute();
        await this.softDelete(category.id);
        return category;
    }
    /**
     * Merges this category into `targetId`: re-points all document assignments (deduplicated),
     * then soft-deletes the source. Self-merge raises 400.
     *
     * @param id The source category id.
     * @param targetId The surviving category id.
     * @returns The surviving category.
     */
    async mergeCategory(id, targetId) {
        if (id === targetId) {
            throw new common_1.BadRequestException('A category cannot be merged into itself');
        }
        const source = await this.findOneByIdString(id);
        const target = await this.findOneByIdString(targetId);
        if (!target) {
            throw new common_1.NotFoundException(`Document category ${targetId} was not found`);
        }
        const manager = this.typeOrmRepository.manager;
        // Re-point assignments that do not already exist on the target (deduplicated)
        const sourceRows = await manager
            .createQueryBuilder()
            .select('"pivot"."documentId"', 'documentId')
            .from('document_category_document', 'pivot')
            .where('"pivot"."documentCategoryId" = :sourceId', { sourceId: source.id })
            .getRawMany();
        const targetRows = await manager
            .createQueryBuilder()
            .select('"pivot"."documentId"', 'documentId')
            .from('document_category_document', 'pivot')
            .where('"pivot"."documentCategoryId" = :targetId', { targetId: target.id })
            .getRawMany();
        const alreadyAssigned = new Set(targetRows.map((row) => row.documentId));
        const toInsert = sourceRows
            .map((row) => row.documentId)
            .filter((documentId) => !alreadyAssigned.has(documentId));
        if (toInsert.length > 0) {
            await manager
                .createQueryBuilder()
                .insert()
                .into('document_category_document', ['documentId', 'documentCategoryId'])
                .values(toInsert.map((documentId) => ({ documentId, documentCategoryId: target.id })))
                .execute();
        }
        await manager
            .createQueryBuilder()
            .delete()
            .from('document_category_document')
            .where('"documentCategoryId" = :sourceId', { sourceId: source.id })
            .execute();
        await this.softDelete(source.id);
        this.logger.log(`Merged document category ${source.id} into ${target.id}`);
        return target;
    }
    /**
     * Resolves the slug an update should persist:
     * - `isSystem` rows keep their slug — it is immutable;
     * - an explicitly supplied `slug` wins (including an empty string — only `null`/`undefined`
     *   count as "not supplied");
     * - otherwise a renamed category re-derives its slug from the new name;
     * - a category that is neither re-slugged nor renamed keeps the stored slug.
     *
     * @param category The stored category.
     * @param input The update payload.
     * @returns The slug to persist.
     */
    resolveUpdatedSlug(category, input) {
        if (category.isSystem) {
            return category.slug;
        }
        if (input.slug !== null && input.slug !== undefined) {
            return input.slug;
        }
        return input.name ? this.slugify(input.name) : category.slug;
    }
    /**
     * Case-insensitive name + slug uniqueness probe; violations raise 409 `DOCS_CATEGORY_EXISTS`.
     */
    async assertUnique(name, slug, tenantId, organizationId) {
        const qb = this.typeOrmRepository.createQueryBuilder('category');
        qb.where((0, core_1.prepareSQLQuery)(`"category"."tenantId" = :tenantId`), { tenantId });
        qb.andWhere((0, core_1.prepareSQLQuery)(`"category"."organizationId" = :organizationId`), { organizationId });
        if (slug) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`(LOWER("category"."name") = :name OR "category"."slug" = :slug)`), {
                name: name.toLowerCase(),
                slug
            });
        }
        else {
            qb.andWhere((0, core_1.prepareSQLQuery)(`LOWER("category"."name") = :name`), { name: name.toLowerCase() });
        }
        const existing = await qb.getOne();
        if (existing) {
            throw new common_1.ConflictException({
                message: `A category named '${name}' already exists`,
                code: docs_constants_1.DOCS_CATEGORY_EXISTS
            });
        }
    }
    /**
     * Derives a kebab-case slug from a display name.
     */
    slugify(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
};
exports.DocumentCategoryService = DocumentCategoryService;
exports.DocumentCategoryService = DocumentCategoryService = DocumentCategoryService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_category_repository_1.TypeOrmDocumentCategoryRepository,
        mikro_orm_document_category_repository_1.MikroOrmDocumentCategoryRepository])
], DocumentCategoryService);
//# sourceMappingURL=document-category.service.js.map