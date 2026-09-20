import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { ID, IDocument, UploadedFile } from '@gauzy/contracts';
import { IDocumentUploadResponse, ReplaceDocumentFileDTO, ReprocessDocumentDTO, UploadDocumentsDTO } from '../dto';
import { DocumentUploadService } from '../services/document-upload.service';
export declare class DocumentUploadController {
    private readonly commandBus;
    private readonly documentUploadService;
    constructor(commandBus: CommandBus, documentUploadService: DocumentUploadService);
    /**
     * Multi-file upload (field `files`, 1–10 files) with per-file accept/reject results.
     *
     * The magic-byte gauntlet never trusts the client MIME: sniffed canonical types only,
     * markup-in-image rejected, no SVG under any name. Oversize → per-file rejection with
     * 413 only when every file is oversize. `importToKnowledge` and `classifyWithAi` are
     * per-upload overrides of the org settings `importToKnowledgeDefault` / `autoClassify`
     * (omitted = follow the organization); accepted files are born `status: UPLOADED` and
     * enter the pipeline at `docs.extract`.
     */
    upload(input: UploadDocumentsDTO, files: UploadedFile[]): Promise<IDocumentUploadResponse>;
    /**
     * Replace-in-place (R-UPL-05): swaps the stored blob of an existing FILE document for the
     * single uploaded file (multipart field `file`).
     *
     * The document id, name, parent, visibility, categories, tags, links, comments and favorites
     * are preserved by construction — only the blob and the columns derived from it change.
     * `version` increments, the extraction state resets, and the pipeline re-runs from
     * `docs.extract` (`reason: 'replace'`, which also forces a fresh thumbnail). The new bytes
     * face the same gauntlet as an upload; a rejected replacement leaves the document untouched
     * and its blob deleted. A PAGE/FOLDER target is a 409 `DOCS_NOT_A_FILE`.
     */
    replaceFile(id: ID, input: ReplaceDocumentFileDTO, files: UploadedFile[]): Promise<IDocument>;
    /**
     * Resolves a provider URL for the stored blob and returns `{ url }` — signed with the
     * provider's `expiresIn` ceiling on S3-compatible storage, minted per request and never
     * cached. FILE documents only (409 `DOCS_NOT_A_FILE` otherwise); an id outside the
     * caller's tenant/organization/visibility scope is a 404.
     */
    download(id: ID): Promise<{
        url: string;
    }>;
    /**
     * Authenticated byte stream of the stored blob — the path used by the preview modal and by
     * every image embedded in a wiki page.
     *
     * Hardening per `08-permissions-security.md` §5.5: `X-Content-Type-Options: nosniff` always,
     * the stored (sniffed) content type only for the render-safe allowlist, and `attachment` +
     * `application/octet-stream` for everything else — stored `text/html` is never served as
     * `text/html` from the API origin.
     */
    raw(id: ID, res: Response): Promise<void>;
    /**
     * Re-runs the pipeline from `docs.extract` for a FILE document.
     * `extractedTextEdited && !overwriteEdited` → 409 `DOCS_EXTRACTED_TEXT_EDITED`.
     */
    reprocess(id: ID, input: ReprocessDocumentDTO): Promise<IDocument>;
}
