import { DocumentKindEnum, DocumentKnowledgeStatusEnum, DocumentReviewReasonEnum, DocumentReviewStatusEnum, DocumentSourceEnum, DocumentStatusEnum, DocumentVisibilityEnum, FileStorageProviderEnum, ID, IDocument, IDocumentCategory, IDocumentLink, IDocumentShare, IDocumentVersion, IEmployee, ITag, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class Document extends TenantOrganizationBaseEntity implements IDocument {
    /**
     * The node kind of the Documents tree: `FOLDER` | `PAGE` | `FILE`.
     * Immutable after create.
     */
    kind: DocumentKindEnum;
    /**
     * Sibling sort order within the parent.
     */
    index: number;
    /**
     * Display name / page title.
     */
    name: string;
    /**
     * Emoji or icon name for tree/card chrome.
     */
    icon?: string;
    /**
     * Hex color for tree/card chrome.
     */
    color?: string;
    /**
     * Short plain-text description.
     */
    description?: string;
    /**
     * PAGE only. Canonical TipTap JSON document.
     * Stored as `jsonb` (PostgreSQL) / `json` (MySQL) / `text` (SQLite — subscriber-serialized).
     */
    contentJson?: JsonData;
    /**
     * PAGE only. Render cache + lexical-search extraction of `contentJson`.
     * Derived; regenerated on save.
     */
    contentHtml?: string;
    /**
     * PAGE only. CRDT state for future realtime collaboration (P2).
     * Written/served but not merged in v1.
     */
    contentBinary?: Buffer;
    /**
     * View-only lock on a PAGE.
     */
    isLocked: boolean;
    /**
     * FILE only. Storage provider of the blob. Excluded from JSON output.
     */
    storageProvider?: FileStorageProviderEnum;
    /**
     * FILE only. Provider object key. Excluded from JSON output.
     */
    storageKey?: string;
    /**
     * FILE only. Provider key of the generated thumbnail. Excluded from JSON output.
     */
    thumbKey?: string;
    /**
     * FILE only. Sniffed (magic-byte) canonical MIME — never the client header.
     */
    mimeType?: string;
    /**
     * FILE only. Size of the stored blob in bytes.
     */
    fileSize?: number;
    /**
     * FILE only. Hex SHA-256 digest of the blob; dedup key.
     */
    sha256?: string;
    /**
     * FILE only. Original filename as uploaded; kept for download naming.
     */
    originalFilename?: string;
    /**
     * FILE: bumped on re-upload in place. PAGE: bumped when a `DocumentVersion` snapshot is captured.
     */
    version: number;
    /**
     * FILE only. Markdown extraction result (search + chunking input). Human-correctable.
     */
    extractedText?: string;
    /**
     * True after a human edits `extractedText`; the pipeline must never overwrite an edited extraction.
     */
    extractedTextEdited: boolean;
    /**
     * AI-generated 1–2 sentence summary.
     */
    summary?: string;
    /**
     * Processing status. Upload path sets `UPLOADED` explicitly; PAGE/FOLDER are born `READY`.
     */
    status: DocumentStatusEnum;
    /**
     * Failure reason, set with `FAILED`; truncated to 500 chars.
     */
    statusMessage?: string;
    /**
     * How the document entered the platform. Immutable after create.
     */
    source: DocumentSourceEnum;
    /**
     * AI knowledge lifecycle status. Importing into AI knowledge is a choice, not automatic.
     */
    knowledgeStatus: DocumentKnowledgeStatusEnum;
    /**
     * Classification confidence 0–1 (clamped). NULL = never classified.
     */
    aiConfidence?: number;
    /**
     * False = metadata-only search (content excluded from lexical search and content-search endpoints).
     */
    searchable: boolean;
    /**
     * Human review circuit-breaker status.
     */
    reviewStatus: DocumentReviewStatusEnum;
    /**
     * Why the document is pending review (kebab-case wire values). Machine-set with `PENDING`.
     */
    reviewReason?: DocumentReviewReasonEnum;
    /**
     * When the review decision was made.
     */
    reviewedAt?: Date;
    /**
     * Visibility scope: `ORGANIZATION` (default) or `PRIVATE`.
     */
    visibility: DocumentVisibilityEnum;
    /**
     * Importer/integration namespace (e.g. `'organization-document'`, `'help-center'`).
     * Together with `externalId` it makes importers idempotent — the partial unique index
     * `UQ_document_external_provenance` over (tenantId, organizationId, externalSource, externalId)
     * is created by the core migration (WHERE "externalSource" IS NOT NULL).
     */
    externalSource?: string;
    /**
     * Id inside `externalSource`.
     */
    externalId?: string;
    /**
     * Catch-all provenance/extension dict (reserved keys: `email`, `chat`, `migration`, `deletion`).
     */
    metadata?: JsonData;
    /** Additional virtual columns */
    /**
     * Virtual. Resolved by subscriber from `storageProvider` + `storageKey` (signed URL where supported).
     */
    fileUrl?: string;
    /**
     * Virtual. Resolved by subscriber from `storageProvider` + `thumbKey`.
     */
    thumbUrl?: string;
    /**
     * Parent node of the tree (`NULL` = root). DB-level cascade is the safety net for hard purges;
     * the service layer implements promote-children vs delete-subtree on soft delete.
     */
    parent?: IDocument;
    /**
     * The UUID of the parent document node.
     */
    parentId?: ID;
    /**
     * The Employee who approved/rejected the review.
     */
    reviewedBy?: IEmployee;
    /**
     * The UUID of the reviewing Employee.
     */
    reviewedById?: ID;
    /**
     * Child nodes of the tree.
     */
    children?: IDocument[];
    /**
     * PAGE content snapshots.
     */
    versions?: IDocumentVersion[];
    /**
     * Overlay sharing grants for `visibility: PRIVATE` documents (P1).
     */
    shares?: IDocumentShare[];
    /**
     * Polymorphic attachments to business records.
     */
    links?: IDocumentLink[];
    /**
     * Free-form tags. One-sided M2M — no inverse property is added to the core `Tag` entity
     * (established plugin precedent).
     */
    tags?: ITag[];
    /**
     * Managed business-document categories (per-org controlled catalog).
     */
    categories?: IDocumentCategory[];
}
