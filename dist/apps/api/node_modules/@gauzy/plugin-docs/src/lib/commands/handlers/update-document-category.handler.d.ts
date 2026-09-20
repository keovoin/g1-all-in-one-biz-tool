import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentCategory } from '@gauzy/contracts';
import { DocumentCategoryService } from '../../services/document-category.service';
import { UpdateDocumentCategoryCommand } from '../update-document-category.command';
export declare class UpdateDocumentCategoryHandler implements ICommandHandler<UpdateDocumentCategoryCommand> {
    private readonly documentCategoryService;
    constructor(documentCategoryService: DocumentCategoryService);
    /**
     * Handles the `UpdateDocumentCategoryCommand`: updates a catalog entry (`isSystem` rows:
     * rename allowed, slug immutable).
     *
     * @param command - The command carrying the id and update payload.
     * @returns The updated category.
     */
    execute(command: UpdateDocumentCategoryCommand): Promise<IDocumentCategory>;
}
