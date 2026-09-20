import { BaseEntityEnum, IBasePerTenantAndOrganizationEntityModel, ID, JsonData } from './base-entity.model';
import { IEmployee } from './employee.model';
import { FileStorageProviderEnum } from './file-provider';
import { IOrganizationTeam } from './organization-team.model';
import { ITag } from './tag.model';
/**
 * Document node kind enum
 *
 * The Documents tree has a single node type discriminated by `kind`:
 * folders and pages can contain children; files are leaves.
 */
export declare enum DocumentKindEnum {
    FOLDER = "FOLDER",
    PAGE = "PAGE",
    FILE = "FILE"
}
/**
 * Document processing status enum
 *
 * FILE documents are born `UPLOADED` and run the processing pipeline;
 * PAGE/FOLDER documents are born `READY`.
 */
export declare enum DocumentStatusEnum {
    UPLOADED = "UPLOADED",
    PROCESSING = "PROCESSING",
    READY = "READY",
    FAILED = "FAILED"
}
/**
 * Document source enum
 *
 * How the document entered the platform. Immutable after create.
 */
export declare enum DocumentSourceEnum {
    UPLOAD = "UPLOAD",
    EDITOR = "EDITOR",
    CHAT = "CHAT",
    EMAIL = "EMAIL",
    INTEGRATION = "INTEGRATION",
    SYSTEM = "SYSTEM",
    IMPORT = "IMPORT"
}
/**
 * Document AI knowledge status enum
 *
 * Importing into AI knowledge is a choice, not automatic — plain uploads stay `NONE`;
 * `EXCLUDED` means explicitly opted out.
 */
export declare enum DocumentKnowledgeStatusEnum {
    NONE = "NONE",
    QUEUED = "QUEUED",
    INDEXING = "INDEXING",
    INDEXED = "INDEXED",
    FAILED = "FAILED",
    EXCLUDED = "EXCLUDED"
}
/**
 * Document review status enum
 *
 * The review circuit breaker: a `PENDING` document with an AI-related review reason
 * is excluded from AI retrieval until approved.
 */
export declare enum DocumentReviewStatusEnum {
    NONE = "NONE",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
/**
 * Document review reason enum
 *
 * Wire/storage values are kebab-case; keys are SCREAMING_CASE.
 */
export declare enum DocumentReviewReasonEnum {
    EXTRACTION_FAILED = "extraction-failed",
    LOW_CONFIDENCE = "low-confidence",
    AI_GENERATED = "ai-generated",
    MANUAL = "manual"
}
/**
 * Document visibility enum
 *
 * `ORGANIZATION` documents are visible to everyone in the organization holding read
 * permission; `PRIVATE` documents are visible to the creator, admins, and explicit
 * share grantees. Children do not inherit visibility.
 */
export declare enum DocumentVisibilityEnum {
    ORGANIZATION = "ORGANIZATION",
    PRIVATE = "PRIVATE"
}
/**
 * Document share access enum
 *
 * `VIEW` (read only) · `COMMENT` (read + comment) · `EDIT` (read + comment + modify
 * content/metadata). Escalation beyond `EDIT` always requires ownership or manage rights.
 */
export declare enum DocumentShareAccessEnum {
    VIEW = "VIEW",
    COMMENT = "COMMENT",
    EDIT = "EDIT"
}
/**
 * Document entity interface
 *
 * The single node of the Documents tree: a folder (`kind = FOLDER`), an authored
 * wiki page (`kind = PAGE`) or an uploaded file (`kind = FILE`).
 */
export interface IDocument extends IBasePerTenantAndOrganizationEntityModel {
    kind: DocumentKindEnum;
    parentId?: ID;
    parent?: IDocument;
    children?: IDocument[];
    index: number;
    name: string;
    icon?: string;
    color?: string;
    description?: string;
    contentJson?: JsonData;
    contentHtml?: string;
    contentBinary?: Uint8Array;
    isLocked: boolean;
    storageProvider?: FileStorageProviderEnum;
    storageKey?: string;
    thumbKey?: string;
    readonly fileUrl?: string;
    readonly thumbUrl?: string;
    mimeType?: string;
    fileSize?: number;
    sha256?: string;
    originalFilename?: string;
    version: number;
    extractedText?: string;
    extractedTextEdited: boolean;
    summary?: string;
    status: DocumentStatusEnum;
    statusMessage?: string;
    source: DocumentSourceEnum;
    knowledgeStatus: DocumentKnowledgeStatusEnum;
    aiConfidence?: number;
    searchable: boolean;
    reviewStatus: DocumentReviewStatusEnum;
    reviewReason?: DocumentReviewReasonEnum;
    reviewedById?: ID;
    reviewedBy?: IEmployee;
    reviewedAt?: Date;
    visibility: DocumentVisibilityEnum;
    externalSource?: string;
    externalId?: string;
    metadata?: JsonData;
    tags?: ITag[];
    categories?: IDocumentCategory[];
    versions?: IDocumentVersion[];
    shares?: IDocumentShare[];
    links?: IDocumentLink[];
}
/**
 * Document category entity interface
 *
 * Per-tenant/org controlled catalog of business-document categories. AI classification
 * assigns categories from this catalog only; unlike tags, categories are a managed vocabulary.
 */
export interface IDocumentCategory extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
    slug: string;
    color?: string;
    icon?: string;
    description?: string;
    isSystem: boolean;
    documents?: IDocument[];
}
/**
 * Document version entity interface
 *
 * Point-in-time snapshot of PAGE content, captured automatically with a
 * server-side debounce; restore is non-destructive.
 */
export interface IDocumentVersion extends IBasePerTenantAndOrganizationEntityModel {
    documentId: ID;
    document?: IDocument;
    name: string;
    contentJson?: JsonData;
    contentHtml?: string;
    contentBinary?: Uint8Array;
    lastSavedAt: Date;
    createdById?: ID;
    createdBy?: IEmployee;
}
/**
 * Document chunk entity interface
 *
 * Retrieval-augmentation chunk of a document's content. Chunks are replaced
 * transactionally as a set on every re-index; they are never edited in place.
 */
export interface IDocumentChunk extends IBasePerTenantAndOrganizationEntityModel {
    documentId: ID;
    chunkIndex: number;
    content: string;
    embedding?: number[];
    tokenCount?: number;
    metadata?: IDocumentChunkMetadata;
}
/**
 * Document chunk metadata interface (citation locators)
 */
export interface IDocumentChunkMetadata {
    headingPath: string[];
    page?: number;
    sheet?: string;
    charRange?: {
        start: number;
        end: number;
    };
}
/**
 * Document index state entity interface
 *
 * Exactly one bookkeeping row per document that has ever been indexed into AI
 * knowledge: which embedding model produced the chunks, at what dimensionality,
 * how many, when, and from which content hash.
 */
export interface IDocumentIndexState extends IBasePerTenantAndOrganizationEntityModel {
    documentId: ID;
    embeddingModel: string;
    embeddingDims: number;
    chunkCount: number;
    lastIndexedAt: Date;
    contentHash: string;
}
/**
 * Document share entity interface
 *
 * Overlay sharing for PRIVATE documents. Exactly one of `employeeId` / `teamId`
 * is set per row (XOR).
 */
export interface IDocumentShare extends IBasePerTenantAndOrganizationEntityModel {
    documentId: ID;
    document?: IDocument;
    employeeId?: ID;
    employee?: IEmployee;
    teamId?: ID;
    team?: IOrganizationTeam;
    access: DocumentShareAccessEnum;
}
/**
 * Document link entity interface
 *
 * Attaches a document to any business record (polymorphic by `entity` + `entityId`).
 * Idempotent per (document, entity, entityId).
 */
export interface IDocumentLink extends IBasePerTenantAndOrganizationEntityModel {
    documentId: ID;
    document?: IDocument;
    entity: BaseEntityEnum;
    entityId: ID;
    metadata?: JsonData;
}
/**
 * Document create input interface
 */
export interface IDocumentCreateInput extends IBasePerTenantAndOrganizationEntityModel {
    kind: DocumentKindEnum;
    name: string;
    parentId?: ID;
    index?: number;
    icon?: string;
    color?: string;
    description?: string;
    contentJson?: JsonData;
    contentHtml?: string;
    contentBinary?: Uint8Array;
    visibility?: DocumentVisibilityEnum;
    tags?: ITag[];
    categoryIds?: ID[];
    importToKnowledge?: boolean;
    mentionEmployeeIds?: ID[];
}
/**
 * Document update input interface
 */
export interface IDocumentUpdateInput extends Partial<Omit<IDocumentCreateInput, 'kind'>> {
}
/**
 * Document move input interface
 */
export interface IDocumentMoveInput extends IBasePerTenantAndOrganizationEntityModel {
    parentId: ID | null;
    index: number;
}
/**
 * Document link create input interface
 */
export interface IDocumentLinkCreateInput extends IBasePerTenantAndOrganizationEntityModel {
    documentId: ID;
    entity: BaseEntityEnum;
    entityId: ID;
    metadata?: JsonData;
}
/**
 * How an organization's inbound capture address is hosted.
 *
 * `PLATFORM` — the zero-config default. The address lives on the deployment-wide inbound domain
 * (`GAUZY_DOCS_INBOUND_DOMAIN`) and is distinguished only by an unguessable per-organization token:
 * `docs-<token>@<platform domain>`. One relay, one webhook secret, every tenant served.
 *
 * `CUSTOM_DOMAIN` — the organization publishes its own domain and routes it at us. The address is
 * `<localPart>@<domain>` with a local part they choose, so it can be `docs@acme.com`. Because the
 * local part is then guessable, ownership of the domain must be proven before the address is armed.
 */
export declare enum DocumentInboundAddressKindEnum {
    PLATFORM = "PLATFORM",
    CUSTOM_DOMAIN = "CUSTOM_DOMAIN"
}
/**
 * Lifecycle of a `CUSTOM_DOMAIN` address. `PLATFORM` addresses are born `VERIFIED` — there is
 * nothing to prove, the platform already owns the domain.
 */
export declare enum DocumentInboundDomainStatusEnum {
    /** Created, DNS record not yet observed. Mail to this address is REJECTED. */
    PENDING = "PENDING",
    /** The expected TXT record was observed. Mail is accepted. */
    VERIFIED = "VERIFIED",
    /** Previously verified, but the record has since disappeared. Mail is REJECTED again. */
    FAILED = "FAILED"
}
/**
 * An organization's inbound email capture address.
 *
 * One row per organization per address. Replaces the previous `tenant_setting`-encoded token, which
 * had no `organizationId` column (the id was parsed out of the setting *name*), no uniqueness
 * guarantee, and no index — making every delivery a full-table `LIKE` scan.
 */
export interface IDocumentInboundAddress extends IBasePerTenantAndOrganizationEntityModel {
    kind: DocumentInboundAddressKindEnum;
    /** Unguessable stem for `PLATFORM` addresses; null for `CUSTOM_DOMAIN`. */
    token?: string | null;
    /** Lower-cased domain for `CUSTOM_DOMAIN`; null for `PLATFORM` (the platform domain applies). */
    domain?: string | null;
    /** Chosen local part for `CUSTOM_DOMAIN` (e.g. `docs`); null for `PLATFORM`. */
    localPart?: string | null;
    /** The resolved address, maintained by the server. Unique across the deployment. */
    address: string;
    domainStatus: DocumentInboundDomainStatusEnum;
    /** Value the organization must publish at `_gauzy-docs.<domain>` in TXT. Never a secret. */
    domainVerificationToken?: string | null;
    domainVerifiedAt?: Date | null;
    domainLastCheckedAt?: Date | null;
    /**
     * SHA-256 of a per-address relay secret. The plaintext is returned exactly once, at creation or
     * rotation, and is never recoverable afterwards.
     */
    webhookSecretHash?: string | null;
    /**
     * Addresses/domains permitted to send here. Empty or absent means "accept any sender that passes
     * SPF/DKIM" — mandated by spec 07 §17.2 and previously unimplemented.
     */
    senderAllowlist?: string[] | null;
    /** Import the message body as a note alongside attachments (spec 07 §17.2). */
    importBodyAsNote?: boolean;
    /** A disabled address rejects mail without being deleted. */
    isActive?: boolean;
    lastMessageAt?: Date | null;
    messageCount?: number;
}
/**
 * Create input. `kind` decides which fields are required: `PLATFORM` takes none of them (the server
 * mints the token), `CUSTOM_DOMAIN` requires `domain` and `localPart`.
 */
export interface IDocumentInboundAddressCreateInput extends IBasePerTenantAndOrganizationEntityModel {
    kind: DocumentInboundAddressKindEnum;
    domain?: string;
    localPart?: string;
    senderAllowlist?: string[];
    importBodyAsNote?: boolean;
}
/**
 * Update input. `kind`, `token` and `address` are server-owned and deliberately absent — changing an
 * address is a rotation, not an edit.
 */
export interface IDocumentInboundAddressUpdateInput extends IBasePerTenantAndOrganizationEntityModel {
    senderAllowlist?: string[];
    importBodyAsNote?: boolean;
    isActive?: boolean;
}
/**
 * Returned once when an address is created or its secret rotated. `webhookSecret` is plaintext here
 * and nowhere else.
 */
export interface IDocumentInboundAddressSecret {
    address: string;
    webhookSecret: string;
}
/**
 * The DNS record an organization must publish to prove it controls a `CUSTOM_DOMAIN`.
 */
export interface IDocumentInboundDomainVerification {
    recordType: 'TXT';
    recordName: string;
    recordValue: string;
    status: DocumentInboundDomainStatusEnum;
    verifiedAt?: Date | null;
    lastCheckedAt?: Date | null;
    /** Populated when a verification attempt fails, so the UI can say why. */
    message?: string;
}
