import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentCategory } from '@gauzy/contracts';
import { DocumentCategoryService } from '../../services/document-category.service';
import { MergeDocumentCategoryCommand } from '../merge-document-category.command';
export declare class MergeDocumentCategoryHandler implements ICommandHandler<MergeDocumentCategoryCommand> {
    private readonly documentCategoryService;
    constructor(documentCategoryService: DocumentCategoryService);
    /**
     * Handles the `MergeDocumentCategoryCommand`: re-points all document assignments to the
     * target (deduplicated), then soft-deletes the source.
     *
     * @param command - The command carrying the source id and target payload.
     * @returns The surviving category.
     */
    execute(command: MergeDocumentCategoryCommand): Promise<IDocumentCategory>;
}
