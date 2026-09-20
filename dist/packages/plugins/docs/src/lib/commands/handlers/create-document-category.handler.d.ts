import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentCategory } from '@gauzy/contracts';
import { DocumentCategoryService } from '../../services/document-category.service';
import { CreateDocumentCategoryCommand } from '../create-document-category.command';
export declare class CreateDocumentCategoryHandler implements ICommandHandler<CreateDocumentCategoryCommand> {
    private readonly documentCategoryService;
    constructor(documentCategoryService: DocumentCategoryService);
    /**
     * Handles the `CreateDocumentCategoryCommand`: creates a catalog entry (case-insensitive
     * unique name per org; slug auto-derived when absent).
     *
     * @param command - The command carrying the create payload.
     * @returns The created category.
     */
    execute(command: CreateDocumentCategoryCommand): Promise<IDocumentCategory>;
}
