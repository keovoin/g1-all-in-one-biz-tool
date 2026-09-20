import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentKnowledgeService } from '../../services/document-knowledge.service';
import { DocumentService } from '../../services/document.service';
import { DocumentSettingsService } from '../../services/document-settings.service';
import { CreateDocumentCommand } from '../create-document.command';
export declare class CreateDocumentHandler implements ICommandHandler<CreateDocumentCommand> {
    private readonly documentService;
    private readonly documentKnowledgeService;
    private readonly documentSettingsService;
    private readonly logger;
    constructor(documentService: DocumentService, documentKnowledgeService: DocumentKnowledgeService, documentSettingsService: DocumentSettingsService);
    /**
     * Handles the `CreateDocumentCommand`: creates a FOLDER or PAGE node and, when asked for,
     * enqueues it into AI knowledge.
     *
     * The knowledge import lives here rather than inside `DocumentService.createDocument()` for a
     * DI reason: `DocumentKnowledgeService` already depends on `DocumentService`, so injecting it
     * the other way round would close a provider cycle. A command handler sits above both.
     *
     * @param command - The command carrying the create payload.
     * @returns The newly created document.
     */
    execute(command: CreateDocumentCommand): Promise<IDocument>;
    /**
     * Whether this create should enqueue the new document into AI knowledge
     * (`02-domain-model.md` §11.4/§12).
     *
     * 🛑 The DTO whitelists `importToKnowledge`, so it has to mean something: it used to be parsed
     * and then dropped while the row was written `knowledgeStatus: NONE` unconditionally — silent
     * acceptance is the one behavior the spec rules out.
     *
     * The explicit payload flag wins; when it is omitted the organization's
     * `importToKnowledgeDefault` decides — the same precedence the upload path applies. FOLDER
     * nodes are never indexable, so they never ask.
     *
     * @param command The create command.
     * @param document The freshly created document.
     * @returns True when the knowledge import should run.
     */
    private shouldImportToKnowledge;
}
