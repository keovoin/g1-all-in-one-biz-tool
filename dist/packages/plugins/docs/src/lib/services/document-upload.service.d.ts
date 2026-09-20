import { ID, UploadedFile } from '@gauzy/contracts';
import { IDocumentUploadResponse, ReplaceDocumentFileDTO, UploadDocumentsDTO } from '../dto';
import { Document } from '../entities/document.entity';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentProcessingService } from './document-processing.service';
import { DocumentQuotaService } from './document-quota.service';
import { DocumentService } from './document.service';
import { DocumentSettingsService } from './document-settings.service';
/** The byte payload of `GET /documents/:id/raw`, already hardened for the wire. */
export interface IDocumentRawFile {
    buffer: Buffer;
    /** Never the stored `text/html`; see `INLINE_SAFE_MIME_TYPES`. */
    contentType: string;
    disposition: 'inline' | 'attachment';
    /** Sanitized, RFC 5987-encodable download name. */
    fileName: string;
}
/**
 * The upload gauntlet of the Documents plugin: per-file magic-byte sniffing against the
 * security allowlist, size enforcement, sha256 dedup lookup, rejected-blob cleanup,
 * initial `Document` row creation (`kind: FILE`, `status: UPLOADED`), and the
 * `docs.extract` enqueue with an explicit tenant snapshot.
 *
 * Validation is per-file with per-file accept/reject results — one invalid file never
 * fails the batch. 413 is returned only when **every** file is oversize; all-rejected
 * (for any mix of reasons) is a 400.
 */
export declare class DocumentUploadService {
    private readonly typeOrmDocumentRepository;
    private readonly documentService;
    private readonly documentSettingsService;
    private readonly documentQuotaService;
    private readonly processingService;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, documentService: DocumentService, documentSettingsService: DocumentSettingsService, documentQuotaService: DocumentQuotaService, processingService: DocumentProcessingService);
    /**
     * Processes one upload batch (1–10 files already streamed into storage by the
     * interceptor) into per-file accept/reject results.
     *
     * @param input The multipart form fields.
     * @param files The provider-mapped uploaded files.
     * @returns The per-file result envelope (201 on the wire).
     */
    uploadDocuments(input: UploadDocumentsDTO, files: UploadedFile[]): Promise<IDocumentUploadResponse>;
    /**
     * The batch-level gates, in the order the security contract fixes them: an empty batch, then
     * the source allowlist, then the parent-kind check. Both post-allowlist failures drop every
     * blob the interceptor already streamed into storage before throwing.
     *
     * @param input The multipart form fields.
     * @param files The provider-mapped uploaded files.
     * @param provider The resolved storage provider (for cleanup).
     * @param source The claimed source, already defaulted to `UPLOAD`.
     */
    private assertBatchAccepted;
    /**
     * Resolves everything the batch needs exactly once: the org defaults each form field can
     * override, and the organization storage-quota state.
     *
     * 🛑 The classification decision is resolved HERE, on the request thread: `getDefaults()`
     * reads the tenant off `RequestContext`, which the queue/inline pipeline threads do not have.
     * The answer rides on the `docs.extract` payload instead of being re-derived in the worker.
     *
     * The quota (08 §5.7) is likewise resolved ONCE per batch; the accepted bytes of this batch
     * accumulate into `quotaState.usedBytes` so a batch cannot slip past the limit by being
     * counted against a stale usage number.
     *
     * @param input The multipart form fields.
     * @param seed The values already resolved on the request thread by the caller.
     * @returns The per-batch context threaded into every file.
     */
    private resolveBatchContext;
    /**
     * Runs one file through the gauntlet, in the fixed order the security contract requires:
     * 1) per-file size cap, 1b) organization quota, 2) magic-byte sniffing, 3) sha256 + dedup,
     * 4) row creation, 5) `docs.extract` enqueue.
     *
     * Rejections are returned rather than thrown so the caller can apply the one cleanup-and-
     * record path to all of them; an unexpected error anywhere in the gauntlet degrades to the
     * same generic rejection the inline try/catch always produced.
     *
     * @param file The stored upload.
     * @param fileName The already-truncated display name.
     * @param context The per-batch context.
     * @returns The accepted result, or the rejection to record.
     */
    private processFile;
    /**
     * Organization storage quota check (08 §5.7). System-originated captures (`QUOTA_WARN_ONLY_
     * SOURCES`) WARN and proceed so automated intake never silently drops a business record;
     * every other source is rejected.
     *
     * @param file The stored upload.
     * @param context The per-batch context (its `quotaState` carries the running batch usage).
     * @returns The rejection to record, or `null` when the file may proceed.
     */
    private rejectOverQuota;
    /**
     * Advisory in-org dedup lookup — it never blocks the upload, it only reports the twin.
     *
     * Soft-deleted rows are excluded by default: dedup is against active rows only, always
     * composite with tenant + organization (no cross-tenant lookup exists).
     *
     * @param sha256 The digest of the stored bytes.
     * @param context The per-batch context.
     * @returns The existing document id holder, or undefined/null when there is no twin.
     */
    private findDuplicate;
    /**
     * Persists one accepted file: the initial `Document` row (`kind: FILE`, `status: UPLOADED`),
     * the `created` CRUD event, and the `docs.extract` enqueue carrying this batch's explicit
     * tenant snapshot and classification decision. Finally the accepted bytes count against the
     * remaining quota of this same batch.
     *
     * @param file The stored upload.
     * @param fileName The already-truncated display name.
     * @param sniff The successful sniff result — its canonical MIME wins over the declared one.
     * @param sha256 The digest of the stored bytes.
     * @param context The per-batch context.
     * @returns The created document row.
     */
    private storeAcceptedFile;
    /**
     * The batch-level failure raised when nothing was accepted: 413 only when EVERY file was
     * oversize; any other all-rejected mix is a 400. The per-file rejections ride along either
     * way so the client can report them file by file.
     *
     * @param rejected The per-file rejections of the batch.
     * @param allOversize Whether every file of the batch tripped the size cap.
     */
    private throwBatchRejected;
    /**
     * `POST /documents/:id/file` — **replace in place** (R-UPL-05).
     *
     * The document row is never recreated, so its id, name, parent, visibility, categories, tags,
     * links, comments and favorites survive untouched: only the blob and the columns derived from
     * it change. `version` increments, the extraction state resets, and the pipeline re-runs from
     * `docs.extract` with `reason: 'replace'` (which is also what forces a fresh thumbnail).
     *
     * The new bytes go through the same gauntlet as an upload — size cap, quota, magic-byte
     * sniffing — and a rejected file's blob is dropped before the rejection is thrown, so a
     * refused replacement leaves both the document and the storage bucket exactly as they were.
     *
     * @param id The FILE document id (RBAC/visibility-scoped, then row-level write-checked).
     * @param file The single stored upload.
     * @param input The multipart form fields.
     * @returns The document after the swap.
     */
    replaceFile(id: ID, file: UploadedFile, input?: ReplaceDocumentFileDTO): Promise<Document>;
    /**
     * Writes the replacement's columns onto the existing row and mirrors them onto the in-memory
     * entity. Everything the spec calls "extraction state" is reset here, so the document cannot
     * keep serving text that describes the file it no longer holds.
     */
    private persistReplacedFile;
    /**
     * `GET /documents/:id/download` — resolves a provider URL for the stored blob and returns
     * `{ url }`; the client navigates/streams from there. S3-compatible providers sign the URL
     * (`expiresIn: 3600`, existing provider behavior), so it is minted per request and never
     * persisted or cached.
     *
     * @param id The FILE document id.
     * @returns The resolved provider URL.
     */
    getDownloadUrl(id: ID): Promise<{
        url: string;
    }>;
    /**
     * `GET /documents/:id/raw` — the authenticated byte path used by previews and by every
     * image embedded in a wiki page. Returns the blob together with the response hardening the
     * caller must apply (`08 §5.5`): a safe content type, and `inline` only for the small
     * render-safe allowlist.
     *
     * Stored `text/html` is deliberately never returned as `text/html` — serving it inline from
     * the API origin would turn an upload into same-origin stored XSS. HTML previews render the
     * sanitized copy instead.
     *
     * @param id The FILE document id.
     * @returns The blob plus its hardened response metadata.
     */
    getRawFile(id: ID): Promise<IDocumentRawFile>;
    /**
     * Resolves a FILE document through the read scope (404 on a cross-org / invisible id) and
     * validates its storage key shape before any provider call.
     */
    private requireFileDocument;
    /**
     * Strips CR/LF, quotes, semicolons and non-printable characters out of a name before it can
     * reach a `Content-Disposition` header (08 §5.3).
     */
    private safeFileName;
    /**
     * Deletes one just-stored blob after a rejection (the image-asset cleanup discipline
     * — bytes of a rejected file are never persisted).
     */
    private cleanupOne;
    /**
     * Deletes every stored blob of a batch (batch-level rejections).
     */
    private cleanupAll;
}
