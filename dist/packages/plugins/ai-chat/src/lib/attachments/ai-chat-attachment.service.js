"use strict";
var AiChatAttachmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatAttachmentService = exports.MAX_ATTACHMENT_BYTES = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const ai_chat_attachment_event_1 = require("./ai-chat-attachment.event");
/**
 * Largest chat attachment accepted.
 *
 * Exported so the route can declare the SAME cap as a multer `limits` — one constant, two
 * enforcement points that cannot drift, exactly as `MAX_AUDIO_BYTES` does for dictation.
 */
exports.MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;
/**
 * AiChatAttachmentService
 *
 * Saves a file a user attached to a chat conversation and announces it on the core event bus as
 * {@link AiChatAttachmentSavedEvent}.
 *
 * The bytes have already been streamed into the configured `FileStorage` provider by the route's
 * interceptor, so this service never touches file content — its whole job is to snapshot the
 * requesting scope while `RequestContext` is still live and publish the event.
 *
 * What happens NEXT is deliberately not this plugin's business: `@gauzy/plugin-docs` subscribes
 * to the event and turns the attachment into a `Document { kind: FILE, source: CHAT }` that rides
 * the standard extraction pipeline, after which the chat's own `docs_search` / `docs_read` tools
 * can read it. On an install without the docs plugin the event simply has no subscriber and the
 * file stays in storage.
 */
let AiChatAttachmentService = AiChatAttachmentService_1 = class AiChatAttachmentService {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(AiChatAttachmentService_1.name);
    }
    /**
     * Records one saved attachment.
     *
     * @param file The uploaded file, already stored by the route's storage engine.
     * @param conversationId The conversation it was attached to, when the client sent one.
     * @returns The stored-object descriptor for the client.
     */
    async save(file, conversationId) {
        if (!file?.key) {
            throw new common_1.BadRequestException('No file was uploaded.');
        }
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = this.resolveOrganizationId();
        if (!tenantId || !organizationId) {
            // Without a scope the attachment cannot be attributed to anything, and a consumer
            // would have to guess — which is how a file ends up in the wrong organization. The bytes
            // are already in storage (multer ran first): remove them rather than leave an orphan.
            await this.discardStoredFile(file.key);
            throw new common_1.BadRequestException('An organization is required to attach a file — send the `Organization-Id` header.');
        }
        const name = String(file.originalname ?? file.filename ?? 'attachment').slice(0, 255);
        const event = new ai_chat_attachment_event_1.AiChatAttachmentSavedEvent({
            tenantId,
            organizationId,
            userId: core_1.RequestContext.currentUserId() ?? undefined,
            ...(conversationId ? { conversationId: conversationId } : {}),
            file: {
                key: file.key,
                originalname: name,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size
            }
        });
        try {
            await this.eventBus.publish(event);
        }
        catch (error) {
            // The file IS saved either way; a bus failure must not read to the user as a failed
            // upload. It only means no capture channel heard about it.
            this.logger.warn(`AiChatAttachmentSavedEvent publish failed: ${error instanceof Error ? error.message : error}`);
        }
        return {
            key: file.key,
            name,
            ...(file.mimetype ? { mimeType: file.mimetype } : {}),
            ...(file.size !== undefined ? { size: file.size } : {})
        };
    }
    /**
     * Removes a stored object that will not be recorded (rejected upload). Best effort: a failure
     * to delete must not mask the rejection the caller is about to see.
     *
     * @param key The storage key of the object.
     */
    async discardStoredFile(key) {
        try {
            await new core_1.FileStorage().getProvider().deleteFile(key);
        }
        catch (error) {
            this.logger.warn(`Could not remove rejected attachment '${key}': ${error instanceof Error ? error.message : error}`);
        }
    }
    /**
     * The requesting organization: the request context first, then the `Organization-Id` header
     * the web client sends on every call (the JWT itself carries no organization).
     */
    resolveOrganizationId() {
        const fromContext = core_1.RequestContext.currentOrganizationId();
        if (fromContext) {
            return fromContext;
        }
        const header = core_1.RequestContext.currentRequest()?.headers?.['organization-id'];
        const value = Array.isArray(header) ? header[0] : header;
        return value ? String(value) : undefined;
    }
};
exports.AiChatAttachmentService = AiChatAttachmentService;
exports.AiChatAttachmentService = AiChatAttachmentService = AiChatAttachmentService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus])
], AiChatAttachmentService);
//# sourceMappingURL=ai-chat-attachment.service.js.map