"use strict";
/**
 * Chat-tool naming shim over the shared prompt-injection hardening module
 * (`knowledge/security/untrusted-content.ts`, spec `07-ai-knowledge.md` §18.1 /
 * `08-permissions-security.md` §7.1).
 *
 * This file used to carry a SECOND neutralizer implementation "so the tools are safe from
 * day one". The two copies drifted — the classification-side one missed the zero-width and
 * bidi ranges the spec pins — which is precisely the bug a shared helper exists to prevent.
 * There is now exactly one implementation; everything below delegates to it and only keeps
 * the names the chat-tool surface (and `@gauzy/plugin-docs` consumers) already import.
 *
 * The pipeline is unchanged: content is (1) stripped of chat-template markers, model
 * special-token spans, leading fake role lines and zero-width/bidi controls, then (2) fenced
 * in `<doc_chunk id="…" untrusted="true">…</doc_chunk>` whose closing tag cannot be forged
 * from inside (any literal occurrence is broken with a zero-width space INSERTED AFTER
 * step 1, so it survives), then (3) followed — once per tool result — by
 * {@link UNTRUSTED_CONTENT_NOTICE}.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNTRUSTED_CONTENT_NOTICE = void 0;
exports.stripPromptControlMarkers = stripPromptControlMarkers;
exports.fenceUntrustedContent = fenceUntrustedContent;
exports.hardenUntrustedContent = hardenUntrustedContent;
const untrusted_content_1 = require("../security/untrusted-content");
/** Low-trust preamble appended once per tool result that carries fenced document content. */
exports.UNTRUSTED_CONTENT_NOTICE = untrusted_content_1.UNTRUSTED_EXCERPT_NOTICE;
/**
 * Neutralizes sequences in untrusted text that could impersonate chat-template structure.
 * Chat-tool alias of the shared {@link stripChatTemplateMarkers}.
 *
 * @param text Raw document content (chunk excerpt or page slice).
 * @returns The text with template markers, control / zero-width / bidi characters, and
 * leading role lines removed.
 */
function stripPromptControlMarkers(text) {
    return (0, untrusted_content_1.stripChatTemplateMarkers)(text);
}
/**
 * Wraps already-stripped untrusted content in the §18.1 fence.
 *
 * Fence-forging defense: any literal `</doc_chunk` remaining inside the content is broken
 * with a zero-width space so the closing fence can only ever be OUR closing fence.
 *
 * @param id Fence identity, `"{documentId}"` or `"{documentId}:{chunkIndex}"`.
 * @param content Untrusted content, already passed through {@link stripPromptControlMarkers}.
 * @returns The fenced block.
 */
function fenceUntrustedContent(id, content) {
    return `<doc_chunk id="${id}" untrusted="true">\n${(0, untrusted_content_1.breakClosingFence)(content, 'doc_chunk')}\n</doc_chunk>`;
}
/**
 * Convenience: strip + fence in one call.
 *
 * @param id Fence identity (`doc:<uuid>` locator material - document id, optionally `:chunkIndex`).
 * @param content Raw untrusted content.
 * @returns The hardened, fenced block.
 */
function hardenUntrustedContent(id, content) {
    return fenceUntrustedContent(id, stripPromptControlMarkers(content));
}
//# sourceMappingURL=untrusted-content.js.map