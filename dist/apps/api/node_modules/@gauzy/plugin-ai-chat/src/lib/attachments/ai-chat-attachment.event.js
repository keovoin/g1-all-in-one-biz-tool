"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatAttachmentSavedEvent = void 0;
const crypto_1 = require("crypto");
/**
 * Published on the core event bus when a user attaches a file to a chat conversation.
 *
 * This is a PUBLISHED CONTRACT, not an internal detail: `@gauzy/plugin-docs` subscribes to it by
 * class (`capture/chat-capture.subscriber.ts`) and turns each attachment into an ordinary
 * `Document { kind: FILE, source: CHAT }` that then rides the standard extraction pipeline. That
 * subscriber feature-detects this export at runtime, so it stayed a permanent no-op for as long
 * as the chat plugin had no attachment feature to publish from.
 *
 * 🛑 The class NAME is part of the contract — the docs plugin resolves it by string
 * (`AI_CHAT_ATTACHMENT_EVENT`), and `EventBus.ofType` filters on constructor identity. Renaming
 * it silently stops chat capture with nothing failing anywhere.
 *
 * Structurally compatible with the core event bus's `BaseEvent` (`id` + `createdAt`) rather than
 * extending it — the base class is not part of the public `@gauzy/core` surface, which is the
 * same reason `DocsAiUsageEvent` is declared this way.
 */
class AiChatAttachmentSavedEvent {
    constructor(payload) {
        this.payload = payload;
        /** Unique event id (BaseEvent shape). */
        this.id = (0, crypto_1.randomUUID)();
        /** Emission timestamp (BaseEvent shape). */
        this.createdAt = new Date();
    }
}
exports.AiChatAttachmentSavedEvent = AiChatAttachmentSavedEvent;
//# sourceMappingURL=ai-chat-attachment.event.js.map