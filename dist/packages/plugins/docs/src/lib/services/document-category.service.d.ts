import { ID, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '@gauzy/core';
import { CreateDocumentCategoryDTO, UpdateDocumentCategoryDTO } from '../dto';
import { DocumentCategory } from '../entities/document-category.entity';
import { MikroOrmDocumentCategoryRepository } from '../repositories/mikro-orm-document-category.repository';
import { TypeOrmDocumentCategoryRepository } from '../repositories/type-orm-document-category.repository';
export declare class DocumentCategoryService extends TenantAwareCrudService<DocumentCategory> {
    readonly typeOrmDocumentCategoryRepository: TypeOrmDocumentCategoryRepository;
    readonly mikroOrmDocumentCategoryRepository: MikroOrmDocumentCategoryRepository;
    private readonly logger;
    constructor(typeOrmDocumentCategoryRepository: TypeOrmDocumentCategoryRepository, mikroOrmDocumentCategoryRepository: MikroOrmDocumentCategoryRepository);
    /**
     * Lists the per-tenant/org category catalog, sorted by name, each item carrying
     * `documentCount`.
     *
     * @param params Pagination + org scope.
     * @returns The catalog page.
     */
    getCategories(params: BaseQueryDTO<DocumentCategory>): Promise<IPagination<DocumentCategory>>;
    /**
     * Creates a catalog entry. Names are unique per organization (case-insensitive);
     * duplicates raise 409 `DOCS_CATEGORY_EXISTS`. The slug is auto-derived when absent.
     *
     * @param input The create payload.
     * @returns The created category.
     */
    createCategory(input: CreateDocumentCategoryDTO): Promise<DocumentCategory>;
    /**
     * Updates a catalog entry. `isSystem` rows may be renamed/recolored but their `slug` is
     * immutable.
     *
     * @param id The category id.
     * @param input The update payload.
     * @returns The updated category.
     */
    updateCategory(id: ID, input: UpdateDocumentCategoryDTO): Promise<DocumentCategory>;
    /**
     * Deletes a catalog entry. `isSystem: true` rows raise 409 `DOCS_CATEGORY_SYSTEM`; in-use
     * categories are detached from documents (pivot rows removed), then soft-deleted.
     *
     * @param id The category id.
     * @returns The soft-deleted category.
     */
    deleteCategory(id: ID): Promise<DocumentCategory>;
    /**
     * Merges this category into `targetId`: re-points all document assignments (deduplicated),
     * then soft-deletes the source. Self-merge raises 400.
     *
     * @param id The source category id.
     * @param targetId The surviving category id.
     * @returns The surviving category.
     */
    mergeCategory(id: ID, targetId: ID): Promise<DocumentCategory>;
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
    private resolveUpdatedSlug;
    /**
     * Case-insensitive name + slug uniqueness probe; violations raise 409 `DOCS_CATEGORY_EXISTS`.
     */
    private assertUnique;
    /**
     * Derives a kebab-case slug from a display name.
     */
    private slugify;
}
