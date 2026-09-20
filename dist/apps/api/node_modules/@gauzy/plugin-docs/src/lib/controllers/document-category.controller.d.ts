import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ID, IDocumentCategory, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { CreateDocumentCategoryDTO, MergeDocumentCategoryDTO, UpdateDocumentCategoryDTO } from '../dto';
import { DocumentCategory } from '../entities/document-category.entity';
export declare class DocumentCategoryController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * The per-tenant/org category catalog, sorted by name; each item includes `documentCount`.
     */
    findAll(params: BaseQueryDTO<DocumentCategory>): Promise<IPagination<IDocumentCategory>>;
    /**
     * Creates a catalog entry (duplicate name → 409 `DOCS_CATEGORY_EXISTS`; slug auto-derived
     * when absent).
     */
    create(input: CreateDocumentCategoryDTO): Promise<IDocumentCategory>;
    /**
     * Updates a catalog entry (`isSystem` rows: rename allowed, slug immutable).
     */
    update(id: ID, input: UpdateDocumentCategoryDTO): Promise<IDocumentCategory>;
    /**
     * Re-points all document assignments to `targetId` (deduplicated), then soft-deletes the
     * source. Self-merge → 400.
     */
    merge(id: ID, input: MergeDocumentCategoryDTO): Promise<IDocumentCategory>;
    /**
     * Deletes a catalog entry (`isSystem: true` → 409 `DOCS_CATEGORY_SYSTEM`); in-use categories
     * are detached from documents, then soft-deleted.
     */
    delete(id: ID): Promise<IDocumentCategory>;
}
