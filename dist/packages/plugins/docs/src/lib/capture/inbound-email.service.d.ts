import { ID } from '@gauzy/contracts';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentProcessingService } from '../services/document-processing.service';
import { IInboundAddressResolver, IInboundEmailAdapter, IInboundWebhookRequest } from './inbound-email.types';
/** Tenant/organization snapshot resolved from the recipient address. */
export interface IInboundScope {
    tenantId: ID;
    organizationId: ID;
}
/** The per-attachment result reported back to the provider. */
export interface IInboundEmailImportResult {
    fileName: string;
    documentId?: ID;
    accepted: boolean;
    code?: string;
}
/** The webhook response envelope. */
export interface IInboundEmailResponse {
    adapter: string;
    organizationId?: ID;
    accepted: number;
    rejected: number;
    results: IInboundEmailImportResult[];
}
/**
 * Inbound-email capture (`07-ai-knowledge.md` §17.2).
 *
 * The whole channel is **off unless `GAUZY_DOCS_INBOUND_EMAIL_ENABLED=true`** — a disabled
 * deployment answers 404 (the route does not exist as far as the world can tell), so
 * enabling it is a deliberate act.
 *
 * Mandatory gates, in order (every one of them fails closed):
 *
 * 1. **Feature switch** — env off ⇒ 404.
 * 2. **Authentication** — EITHER the deployment-wide HMAC signature the adapter verifies, OR a
 *    per-address relay secret in `x-gauzy-docs-address-secret`. Neither ⇒ 403, raised before the
 *    unknown-address 404 so a caller with no secret cannot enumerate real capture addresses.
 * 3. **Recipient address match** — the whole address is looked up in `document_inbound_address`
 *    (unique index). Unknown, inactive, or an unverified custom domain ⇒ 404 — identical to
 *    "no such route", so probing cannot enumerate organizations.
 * 4. **SPF/DKIM** — when the provider reports verdicts, both must pass.
 * 4b. **Sender allowlist** — per-address; empty means "any sender that passed gate 4".
 * 5. **Size caps** — per message (`GAUZY_DOCS_INBOUND_MAX_MESSAGE_BYTES`) and per attachment
 *    (`GAUZY_DOCS_MAX_FILE_SIZE`).
 * 6. **Attachments only** — the body is discarded; a message with no attachment is rejected.
 * 7. **Content sniffing** — the same magic-byte gauntlet the upload endpoint runs.
 *
 * Resulting documents land as `source: EMAIL`, `reviewStatus: PENDING`
 * (`reviewReason: manual`) and `knowledgeStatus: NONE` — **never auto-imported to the AI
 * knowledge base**. A human approves them in the review queue first.
 *
 * There is no `RequestContext` on a webhook thread, so every write carries the explicit
 * tenant/organization snapshot resolved from the recipient address.
 */
export declare class InboundEmailService {
    private readonly typeOrmDocumentRepository;
    private readonly processingService;
    /** Address resolution + allowlist, behind a token so storage stays out of this path. */
    private readonly inboundAddressService;
    /** The provider adapter; the generic signed-webhook reference adapter is the default binding. */
    private readonly adapter?;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, processingService: DocumentProcessingService, 
    /** Address resolution + allowlist, behind a token so storage stays out of this path. */
    inboundAddressService: IInboundAddressResolver, 
    /** The provider adapter; the generic signed-webhook reference adapter is the default binding. */
    adapter?: IInboundEmailAdapter);
    /**
     * Handles one inbound webhook delivery end to end.
     *
     * @param request The transport-neutral webhook request.
     * @returns The per-attachment result envelope.
     */
    handleWebhook(request: IInboundWebhookRequest): Promise<IInboundEmailResponse>;
    /**
     * Stores one attachment and creates its `Document` row.
     *
     * @param scope The resolved tenant/organization.
     * @param message The parsed message (provenance only).
     * @param attachment The attachment to import.
     * @returns The per-attachment result.
     */
    private importAttachment;
    /**
     * Builds the storage key of an inbound attachment — **exactly** the shape the upload
     * endpoint uses (`DocumentUploadController.documentsStorage`):
     * `documents/<tenantId>/<organizationId>/<uuid>.<canonicalExtension>`.
     *
     * The client-supplied attachment name NEVER enters the key. It is attacker-controlled
     * on the least trusted input surface this plugin has, and putting it in the key was
     * three bugs in one: objects of different tenants sharing one flat `documents/inbound/`
     * prefix collided and overwrote each other, the name carried whatever extension the
     * sender chose rather than the sniffed one, and a storage adapter that does not
     * normalize its keys could be walked out of the prefix with `../`. The original name
     * survives on `name` / `originalFilename`, which are data, not paths.
     *
     * @param scope The resolved tenant/organization.
     * @param mimeType The SNIFFED canonical MIME (never the declared one).
     * @returns The server-generated storage key.
     */
    private buildStorageKey;
    /**
     * Reads the per-address relay secret header, case-insensitively, tolerating the array form a
     * repeated header produces. Returns undefined when absent — the caller then relies on the
     * deployment-wide signature instead.
     */
    private readAddressSecretHeader;
}
