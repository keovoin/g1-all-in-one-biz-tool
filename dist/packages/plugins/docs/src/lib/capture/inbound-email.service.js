"use strict";
var InboundEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundEmailService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const file_sniffer_1 = require("../services/file-sniffer");
const document_processing_service_1 = require("../services/document-processing.service");
const inbound_email_types_1 = require("./inbound-email.types");
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
let InboundEmailService = InboundEmailService_1 = class InboundEmailService {
    constructor(typeOrmDocumentRepository, processingService, inboundAddressService, adapter) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.processingService = processingService;
        this.inboundAddressService = inboundAddressService;
        this.adapter = adapter;
        this.logger = new common_1.Logger(InboundEmailService_1.name);
    }
    /**
     * Handles one inbound webhook delivery end to end.
     *
     * @param request The transport-neutral webhook request.
     * @returns The per-attachment result envelope.
     */
    async handleWebhook(request) {
        const config = (0, docs_config_1.getDocsConfig)();
        // Gate 1 — the channel is off unless explicitly enabled.
        if (!config.inboundEmailEnabled) {
            throw new common_1.NotFoundException({
                message: 'The inbound-email capture channel is not enabled',
                code: docs_constants_1.DOCS_INBOUND_DISABLED
            });
        }
        if (!this.adapter) {
            throw new common_1.NotFoundException({
                message: 'No inbound-email adapter is bound',
                code: docs_constants_1.DOCS_INBOUND_DISABLED
            });
        }
        // Gate 2 — authentication. Two independent proofs are accepted:
        //
        //   (a) the deployment-wide HMAC signature the adapter verifies, and
        //   (b) a per-address relay secret presented in `x-gauzy-docs-address-secret`.
        //
        // (b) exists because one global secret means a single leak lets an attacker post mail *as
        // any tenant*. A per-address secret contains that to one organization. It is presented
        // rather than used as an HMAC key because only its SHA-256 is stored — a database read
        // therefore cannot forge a delivery for the address.
        //
        // 🛑 Ordering matters for enumeration. The address must be resolved BEFORE (b) can be
        // checked, so resolution happens on unauthenticated input; the failure for "no valid proof"
        // is therefore raised BEFORE the unknown-address 404. Without that, a caller with no secret
        // at all could tell a real capture address (403) from a fake one (404) and enumerate them.
        // `parse` is documented and tested to be total — it never throws on hostile input.
        const globalSignatureOk = this.adapter.verifySignature(request);
        const message = await this.adapter.parse(request);
        const inboundAddress = await this.inboundAddressService.resolveByAddress(message.recipient);
        const presentedSecret = this.readAddressSecretHeader(request);
        const perAddressSecretOk = inboundAddress
            ? this.inboundAddressService.verifySecret(inboundAddress, presentedSecret)
            : false;
        if (!globalSignatureOk && !perAddressSecretOk) {
            throw new common_1.ForbiddenException({
                message: 'Invalid inbound-email webhook signature',
                code: docs_constants_1.DOCS_INBOUND_SIGNATURE_INVALID
            });
        }
        // Gate 3 — recipient address match. Resolved against `document_inbound_address` on a unique
        // index over the WHOLE address, so the domain is now load-bearing: the previous parser threw
        // the domain away, which meant `docs-<token>@anything-at-all` resolved exactly as well as
        // the real capture domain.
        if (!inboundAddress) {
            // Deliberately identical to "no such route" — an unknown address reveals nothing.
            throw new common_1.NotFoundException({
                message: 'Unknown capture address',
                code: docs_constants_1.DOCS_INBOUND_UNKNOWN_RECIPIENT
            });
        }
        const scope = {
            tenantId: inboundAddress.tenantId,
            organizationId: inboundAddress.organizationId
        };
        // Gate 4 — authentication verdicts, when the provider reports them.
        if (message.spfPass === false || message.dkimPass === false) {
            throw new common_1.ForbiddenException({
                message: 'The message failed SPF/DKIM verification',
                code: docs_constants_1.DOCS_INBOUND_SIGNATURE_INVALID
            });
        }
        // Gate 4b — sender allowlist (spec 07 §17.2). Mandated but previously unimplemented, and it
        // is what keeps a *guessable* custom-domain address (`docs@acme.com`) from being an open
        // drop-box. An empty allowlist means "any sender that got past SPF/DKIM".
        if (!this.inboundAddressService.isSenderAllowed(inboundAddress, message.sender)) {
            throw new common_1.ForbiddenException({
                message: 'The sender is not on this address’s allowlist',
                code: docs_constants_1.DOCS_INBOUND_SENDER_NOT_ALLOWED
            });
        }
        // Gate 5 — per-message size cap.
        const messageBytes = message.sizeBytes ?? message.attachments.reduce((sum, attachment) => sum + attachment.sizeBytes, 0);
        if (messageBytes > config.inboundMaxMessageBytes) {
            throw new common_1.PayloadTooLargeException({
                message: `The message exceeds the ${config.inboundMaxMessageBytes}-byte inbound cap`,
                code: docs_constants_1.DOCS_INBOUND_TOO_LARGE
            });
        }
        // Gate 6 — attachments only; the body is discarded.
        if (!message.attachments.length) {
            throw new common_1.BadRequestException({
                message: 'The message carried no attachment — inbound capture is attachments-only',
                code: docs_constants_1.DOCS_INBOUND_NO_ATTACHMENTS
            });
        }
        const results = [];
        for (const attachment of message.attachments) {
            results.push(await this.importAttachment(scope, message, attachment));
        }
        const accepted = results.filter((result) => result.accepted).length;
        if (accepted > 0) {
            await this.inboundAddressService.recordDelivery(inboundAddress);
        }
        this.logger.log(`Inbound-email capture for organization ${scope.organizationId}: ${accepted}/${results.length} attachment(s) imported.`);
        return {
            adapter: this.adapter.id,
            organizationId: scope.organizationId,
            accepted,
            rejected: results.length - accepted,
            results
        };
    }
    /**
     * Stores one attachment and creates its `Document` row.
     *
     * @param scope The resolved tenant/organization.
     * @param message The parsed message (provenance only).
     * @param attachment The attachment to import.
     * @returns The per-attachment result.
     */
    async importAttachment(scope, message, attachment) {
        const config = (0, docs_config_1.getDocsConfig)();
        const fileName = attachment.fileName.slice(0, 255);
        // Per-attachment size cap — the same limit the upload endpoint enforces.
        if (attachment.sizeBytes > config.maxFileSize) {
            return { fileName, accepted: false, code: docs_constants_1.DOCS_INBOUND_TOO_LARGE };
        }
        // The same magic-byte gauntlet as the upload path — a mail attachment is the least
        // trusted input surface this plugin has.
        const sniff = (0, file_sniffer_1.sniffFile)(attachment.content, fileName, attachment.contentType);
        if (!sniff.ok) {
            return { fileName, accepted: false, code: sniff.code };
        }
        try {
            const provider = new core_1.FileStorage().getProvider();
            const stored = await provider.putFile(attachment.content, this.buildStorageKey(scope, sniff.type.mimeType));
            const sha256 = (0, crypto_1.createHash)('sha256').update(attachment.content).digest('hex');
            const document = await this.typeOrmDocumentRepository.save(this.typeOrmDocumentRepository.create({
                tenantId: scope.tenantId,
                organizationId: scope.organizationId,
                kind: contracts_1.DocumentKindEnum.FILE,
                name: fileName,
                status: contracts_1.DocumentStatusEnum.UPLOADED,
                source: contracts_1.DocumentSourceEnum.EMAIL,
                // NEVER auto-imported to knowledge (§17.2) — a human approves first.
                knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.NONE,
                reviewStatus: contracts_1.DocumentReviewStatusEnum.PENDING,
                reviewReason: contracts_1.DocumentReviewReasonEnum.MANUAL,
                visibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION,
                storageProvider: provider.name.toUpperCase(),
                storageKey: stored.key,
                mimeType: sniff.type.mimeType,
                fileSize: attachment.sizeBytes,
                sha256,
                originalFilename: fileName,
                version: 1,
                metadata: {
                    inboundEmail: {
                        // Provenance only — no body, no recipient token.
                        sender: message.sender ?? null,
                        subject: message.subject ?? null,
                        messageId: message.messageId ?? null,
                        receivedAt: message.receivedAt ?? null,
                        canonicalExtension: (0, file_sniffer_1.canonicalExtension)(sniff.type.mimeType)
                    }
                }
            }));
            // Extraction still runs (it feeds the preview + the review queue); indexing does not.
            await this.processingService.enqueueExtract(document, 'upload');
            return { fileName, documentId: document.id, accepted: true };
        }
        catch (error) {
            this.logger.error(`Inbound-email attachment import failed: ${error.message}`);
            return { fileName, accepted: false, code: docs_constants_1.DOCS_INBOUND_NO_ATTACHMENTS };
        }
    }
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
    buildStorageKey(scope, mimeType) {
        // The ids are UUID columns, but a key segment is never built from an unvalidated value.
        // (`randomUUID` rather than the `uuid` package: same v4 shape, no ESM-only dependency.)
        const segment = (value) => String(value ?? '').replace(/[^a-zA-Z0-9-]/g, '') || (0, crypto_1.randomUUID)();
        const extension = (0, file_sniffer_1.canonicalExtension)(mimeType);
        return `documents/${segment(scope.tenantId)}/${segment(scope.organizationId)}/${(0, crypto_1.randomUUID)()}.${extension}`;
    }
    /**
     * Reads the per-address relay secret header, case-insensitively, tolerating the array form a
     * repeated header produces. Returns undefined when absent — the caller then relies on the
     * deployment-wide signature instead.
     */
    readAddressSecretHeader(request) {
        const headers = (request?.headers ?? {});
        for (const [key, value] of Object.entries(headers)) {
            if (key.toLowerCase() === docs_constants_1.DOCS_INBOUND_ADDRESS_SECRET_HEADER) {
                const raw = Array.isArray(value) ? value[0] : value;
                const trimmed = String(raw ?? '').trim();
                return trimmed.length ? trimmed : undefined;
            }
        }
        return undefined;
    }
};
exports.InboundEmailService = InboundEmailService;
exports.InboundEmailService = InboundEmailService = InboundEmailService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, common_1.Inject)(inbound_email_types_1.DOCS_INBOUND_ADDRESS_RESOLVER)),
    tslib_1.__param(3, (0, common_1.Optional)()),
    tslib_1.__param(3, (0, common_1.Inject)(inbound_email_types_1.DOCS_INBOUND_EMAIL_ADAPTER)),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        document_processing_service_1.DocumentProcessingService, Object, Object])
], InboundEmailService);
//# sourceMappingURL=inbound-email.service.js.map