/**
 * Prompt-injection hardening helpers (`07-ai-knowledge.md` §18.1 /
 * `08-permissions-security.md` §7.1).
 *
 * Document content is **untrusted input** at every AI boundary. This module is the ONE
 * neutralization/fencing implementation in the plugin — classification (§5.4), the
 * `docs_search`/`docs_read` chat tools (§11.3) and any future prompt surface all route
 * through {@link neutralizeUntrustedContent}. `knowledge/chat-tools/untrusted-content.ts`
 * is a thin naming shim over these functions, not a second implementation: two copies had
 * already drifted apart (the classification copy stripped only C0/C1 control bytes and
 * missed the zero-width/bidi ranges the spec pins), which is exactly the failure mode a
 * shared helper exists to prevent.
 *
 * Neutralization order matters: markers and control characters are stripped FIRST, then
 * the closing fence is broken with a zero-width space — so the space we insert survives
 * the zero-width strip.
 *
 * Pure functions — no Nest wiring.
 */
/**
 * The single neutralizer: strips chat-template control markers, C0/C1 control characters
 * (except `\n`/`\t`), zero-width/bidi characters, and leading fake role lines from
 * untrusted document content.
 *
 * @param content Raw untrusted text.
 * @returns The neutralized text.
 */
export declare function stripChatTemplateMarkers(content: string): string;
/**
 * Breaks any literal occurrence of a closing fence tag inside content with a zero-width
 * space so the fence cannot be forged from inside the document.
 *
 * Always applied AFTER {@link stripChatTemplateMarkers} — the inserted zero-width space is
 * itself in the stripped range.
 *
 * @param content The untrusted text.
 * @param tagName The fence tag name (e.g. `document_content`, `doc_chunk`).
 */
export declare function breakClosingFence(content: string, tagName: string): string;
/**
 * Full neutralization applied before untrusted content enters a prompt: chat-template
 * markers stripped, control / zero-width / bidi characters removed, leading role lines
 * dropped, closing fence broken.
 */
export declare function neutralizeUntrustedContent(content: string, tagName: string): string;
/**
 * Wraps untrusted document content in the classification fence
 * (`<document_content untrusted="true">…</document_content>`).
 */
export declare function fenceDocumentContent(content: string): string;
/**
 * Wraps one retrieval chunk in the chat-tool fence
 * (`<doc_chunk id="{documentId}:{chunkIndex}" untrusted="true">…</doc_chunk>`), for use by
 * the `docs_search` tool result renderer.
 */
export declare function fenceDocChunk(content: string, documentId: string, chunkIndex: number): string;
/**
 * The low-trust preamble appended once per tool result after fenced excerpts.
 */
export declare const UNTRUSTED_EXCERPT_NOTICE: string;
