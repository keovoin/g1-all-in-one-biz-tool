"use strict";
var ChatCaptureSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCaptureSubscriber = exports.AI_CHAT_ATTACHMENT_EVENT = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const document_processing_service_1 = require("../services/document-processing.service");
const file_sniffer_1 = require("../services/file-sniffer");
/**
 * The event class name this subscriber binds to when the chat plugin exports it
 * (`07-ai-knowledge.md` §17.1). Kept as a string so a missing export is a *runtime*
 * feature-detection miss, not a compile error.
 */
exports.AI_CHAT_ATTACHMENT_EVENT = 'AiChatAttachmentSavedEvent';
/**
 * Chat capture (`07-ai-knowledge.md` §17.1).
 *
 * `@gauzy/plugin-ai-chat` is expected to publish `AiChatAttachmentSavedEvent` on the core
 * RxJS event bus when a user attaches a file to a conversation. This plugin subscribes and
 * turns that file into an ordinary `Document { kind: FILE, source: CHAT }` that then rides
 * the standard pipeline unchanged.
 *
 * **The chat plugin does not emit that event yet.** Adding attachment upload is its own M5
 * work item, and the event contract above is what this plugin consumes. Rather than ship a
 * dangling TODO, this subscriber **feature-detects the event class at runtime**:
 *
 * - the class IS exported ⇒ a live subscription is created and attachments are captured;
 * - the class is NOT exported (today) ⇒ a **registered no-op subscriber** stays in place,
 *   logs one debug line at bootstrap, and does nothing else. The seam is wired, so the day
 *   the chat plugin starts exporting + publishing the event, capture begins with **zero**
 *   changes on this side.
 *
 * Captured documents land as `source: CHAT`, `reviewStatus: PENDING` (`reason: manual`) and
 * `knowledgeStatus: NONE` — like every other capture channel, they are never auto-imported
 * into the AI knowledge base.
 */
let ChatCaptureSubscriber = ChatCaptureSubscriber_1 = class ChatCaptureSubscriber {
    constructor(eventBus, typeOrmDocumentRepository, processingService) {
        this.eventBus = eventBus;
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.processingService = processingService;
        this.logger = new common_1.Logger(ChatCaptureSubscriber_1.name);
    }
    /** Whether a live subscription was established (as opposed to the no-op fallback). */
    get isActive() {
        return !!this.subscription;
    }
    /**
     * Feature-detects the chat attachment event and subscribes when it exists.
     */
    onModuleInit() {
        const eventClass = this.resolveAttachmentEventClass();
        if (!eventClass) {
            this.logger.debug(`${exports.AI_CHAT_ATTACHMENT_EVENT} is not exported by @gauzy/plugin-ai-chat — ` +
                'chat capture is registered as a no-op until the chat plugin emits it.');
            return;
        }
        try {
            this.subscription = this.eventBus.ofType(eventClass).subscribe({
                next: (event) => void this.captureAttachment(event?.payload ?? event),
                error: (error) => this.logger.warn(`Chat capture stream error: ${error?.message}`)
            });
            this.logger.log(`Chat capture active — subscribed to ${exports.AI_CHAT_ATTACHMENT_EVENT}.`);
        }
        catch (error) {
            this.logger.warn(`Failed to subscribe to ${exports.AI_CHAT_ATTACHMENT_EVENT}: ${error.message}`);
        }
    }
    /** Drops the subscription on teardown (no-op when it was never established). */
    onModuleDestroy() {
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }
    /**
     * Turns one saved chat attachment into a `Document { kind: FILE, source: CHAT }`.
     *
     * Runs off the request path (event bus), so the tenant/organization scope comes from the
     * event payload — `RequestContext` is never consulted.
     *
     * @param payload The attachment-saved payload.
     */
    async captureAttachment(payload) {
        if (!payload?.tenantId || !payload?.organizationId || !payload?.file?.key) {
            this.logger.debug('Chat attachment event ignored — incomplete payload.');
            return null;
        }
        const fileName = String(payload.file.originalname ?? payload.file.filename ?? 'attachment').slice(0, 255);
        try {
            const provider = new core_1.FileStorage().getProvider();
            const buffer = (await provider.getFile(payload.file.key));
            // The same magic-byte gauntlet as the upload endpoint — a chat attachment is
            // user-supplied content and gets no discount.
            const sniff = (0, file_sniffer_1.sniffFile)(buffer, fileName, payload.file.mimetype);
            if (!sniff.ok) {
                this.logger.warn(`Chat attachment '${fileName.slice(0, 40)}' rejected: ${sniff.code}`);
                // Nothing will ever reference a REJECTED object: remove it instead of leaving an orphan
                // (best effort — the rejection stands either way). Only when the bytes were actually READ:
                // LocalProvider.getFile swallows fs errors and returns undefined, and a transient read
                // failure must not destroy a valid attachment. A zero-length Buffer is a successful read
                // of an empty file (which sniffFile rejects) — that one IS ours to clean up, so the test
                // is "is it a Buffer", not "is it non-empty".
                if (Buffer.isBuffer(buffer)) {
                    try {
                        await provider.deleteFile(payload.file.key);
                    }
                    catch (error) {
                        this.logger.warn(`Could not remove rejected chat attachment '${payload.file.key}': ${error?.message ?? error}`);
                    }
                }
                return null;
            }
            const document = await this.typeOrmDocumentRepository.save(this.typeOrmDocumentRepository.create({
                tenantId: payload.tenantId,
                organizationId: payload.organizationId,
                kind: contracts_1.DocumentKindEnum.FILE,
                name: fileName,
                status: contracts_1.DocumentStatusEnum.UPLOADED,
                source: contracts_1.DocumentSourceEnum.CHAT,
                // Capture channels never auto-import into knowledge (§17).
                knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.NONE,
                reviewStatus: contracts_1.DocumentReviewStatusEnum.PENDING,
                reviewReason: contracts_1.DocumentReviewReasonEnum.MANUAL,
                visibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION,
                storageProvider: provider.name.toUpperCase(),
                storageKey: payload.file.key,
                mimeType: sniff.type.mimeType,
                fileSize: payload.file.size ?? buffer.length,
                sha256: (0, crypto_1.createHash)('sha256').update(buffer).digest('hex'),
                originalFilename: fileName,
                version: 1,
                createdByUserId: payload.userId ?? null,
                metadata: {
                    chatCapture: {
                        conversationId: payload.conversationId ?? null,
                        canonicalExtension: (0, file_sniffer_1.canonicalExtension)(sniff.type.mimeType)
                    }
                }
            }));
            await this.processingService.enqueueExtract(document, 'upload');
            return document;
        }
        catch (error) {
            // Capture is best-effort: a failure must never break the chat turn that produced it.
            this.logger.error(`Chat attachment capture failed: ${error.message}`);
            return null;
        }
    }
    /**
     * Runtime feature detection of the chat attachment event class.
     *
     * @returns The event constructor when the chat plugin exports it, else undefined.
     */
    resolveAttachmentEventClass() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const aiChat = require('@gauzy/plugin-ai-chat');
            const candidate = aiChat?.[exports.AI_CHAT_ATTACHMENT_EVENT];
            return typeof candidate === 'function' ? candidate : undefined;
        }
        catch (error) {
            this.logger.debug(`@gauzy/plugin-ai-chat could not be loaded: ${error.message}`);
            return undefined;
        }
    }
};
exports.ChatCaptureSubscriber = ChatCaptureSubscriber;
exports.ChatCaptureSubscriber = ChatCaptureSubscriber = ChatCaptureSubscriber_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus,
        type_orm_document_repository_1.TypeOrmDocumentRepository,
        document_processing_service_1.DocumentProcessingService])
], ChatCaptureSubscriber);
//# sourceMappingURL=chat-capture.subscriber.js.map