import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentCategory } from '@gauzy/contracts';
import { DocumentCategoryService } from '../../services/document-category.service';
import { DeleteDocumentCategoryCommand } from '../delete-document-category.command';
export declare class DeleteDocumentCategoryHandler implements ICommandHandler<DeleteDocumentCategoryCommand> {
    private readonly documentCategoryService;
    constructor(documentCategoryService: DocumentCategoryService);
    /**
     * Handles the `DeleteDocumentCategoryCommand`: detaches the category from documents, then
     * soft-deletes it (`isSystem: true` rows are rejected with 409).
     *
     * @param command - The command carrying the id.
     * @returns The soft-deleted category.
     */
    execute(command: DeleteDocumentCategoryCommand): Promise<IDocumentCategory>;
}
