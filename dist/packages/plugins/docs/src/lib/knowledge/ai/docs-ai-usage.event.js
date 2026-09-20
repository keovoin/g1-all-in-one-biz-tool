"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsAiUsageEvent = void 0;
const crypto_1 = require("crypto");
/**
 * Cost-accounting event emitted by every embedding and classification call site
 * (§7.4 of the AI-knowledge spec).
 *
 * P0 consumes this with a structured-log handler only; P2 adds the daily rollup + budget
 * enforcement. No prompt or document content is ever included in the event.
 *
 * Structurally compatible with the core event bus's `BaseEvent` (`id` + `createdAt`) —
 * the base class itself is not part of the public `@gauzy/core` surface.
 */
class DocsAiUsageEvent {
    constructor(payload) {
        this.payload = payload;
        /** Unique event id (BaseEvent shape). */
        this.id = (0, crypto_1.randomUUID)();
        /** Emission timestamp (BaseEvent shape). */
        this.createdAt = new Date();
    }
}
exports.DocsAiUsageEvent = DocsAiUsageEvent;
//# sourceMappingURL=docs-ai-usage.event.js.map