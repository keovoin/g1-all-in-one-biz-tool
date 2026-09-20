import { IQueryHandler } from '@nestjs/cqrs';
import { IDocumentCategory, IPagination } from '@gauzy/contracts';
import { DocumentCategoryService } from '../../services/document-category.service';
import { GetDocumentCategoriesQuery } from '../get-document-categories.query';
export declare class GetDocumentCategoriesHandler implements IQueryHandler<GetDocumentCategoriesQuery> {
    private readonly documentCategoryService;
    constructor(documentCategoryService: DocumentCategoryService);
    /**
     * Handles the `GetDocumentCategoriesQuery`: the per-tenant/org catalog, sorted by name,
     * each item carrying `documentCount`.
     *
     * @param query - The query carrying pagination + org scope.
     * @returns The catalog page.
     */
    execute(query: GetDocumentCategoriesQuery): Promise<IPagination<IDocumentCategory>>;
}
