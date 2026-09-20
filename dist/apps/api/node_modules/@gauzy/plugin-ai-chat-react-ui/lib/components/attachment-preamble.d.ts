/**
 * The attachment preamble: how staged attachments travel inside the user's message text,
 * and how the transcript UI recognizes them again to render chips instead of raw lines.
 *
 * Attachments ride as ordinary message TEXT on purpose. The tool surface the assistant has is
 * `docs_read(documentId)` / `docs_search(query)`, so naming the ids in the message is precisely
 * what makes an attachment actionable — and because the text is part of the message history, the
 * attachment context survives every later turn and conversation reload with zero extra plumbing.
 * A side channel the model never sees (metadata, data parts) would be decoration: AI SDK data
 * parts are not model-visible in converted history.
 *
 * The cost of that mechanism is that the raw preamble would show inside the user's own bubble.
 * {@link parseAttachmentPreamble} is the display-side answer: the transcript recognizes the exact
 * format {@link buildAttachmentPreamble} emits (plus the legacy wording earlier builds produced)
 * and renders chips + the user's own words. Parsing only ever affects DISPLAY — the model always
 * sees the full text — so a user hand-typing something preamble-shaped merely gets it rendered
 * as chips, which is harmless. Parsing is deliberately regex-free on the name segment: the input
 * is uncontrolled message text, and a backtracking quantifier over embedded quotes is exactly the
 * polynomial-ReDoS shape CodeQL flags. Everything here is single-pass `indexOf` work.
 */
/** One attachment staged on the next message. */
export interface IStagedAttachment {
    /** Set when the document exists in Documents — the handle `docs_read` takes. */
    documentId?: string;
    /** Display name, and the only handle an attachment has when Documents is unavailable. */
    name: string;
    /**
     * `PAGE` when the attachment is a Documents PAGE (a written page opens at its editor route,
     * not the file browser). Anything else — including absent, as in all legacy history — is
     * treated as a file for linking purposes.
     */
    kind?: 'FILE' | 'PAGE';
}
/**
 * Build the preamble for the staged attachments.
 *
 * Two line shapes:
 * - With an id — the document is in Documents (picked from the library, or uploaded id-first):
 *   the assistant is told to read exactly that document. `docs_read` itself explains the
 *   still-processing state for a fresh upload, so no hedging is needed here. PAGE documents get
 *   a `, page` marker inside the parenthetical so a chip rebuilt from history can link to the
 *   page editor rather than the file browser; the model reads straight past it.
 * - Without an id — Documents is unavailable on this install (the id-first upload fell back to
 *   plain chat storage), which also means the `docs_*` tools are not registered. The line only
 *   STATES the attachment; earlier builds told the assistant to `docs_search` for it, which
 *   could never succeed — chat-captured documents are not auto-indexed, and on fallback
 *   installs the tool does not even exist.
 *
 * @param attachments The staged attachments.
 * @returns The preamble, or an empty string when nothing is attached.
 */
export declare function buildAttachmentPreamble(attachments: IStagedAttachment[]): string;
/** What {@link parseAttachmentPreamble} recovers from a message's text. */
export interface IParsedAttachmentPreamble {
    /** The attachments named by the preamble, in order. */
    attachments: IStagedAttachment[];
    /** The user's own message text, with the preamble removed. May be empty. */
    text: string;
}
/**
 * Recognize a message that starts with an attachment preamble.
 *
 * Strict on the load-bearing parts (exact header as the FIRST line, at least one attachment
 * line immediately after) and tolerant on the instruction wording, so both current and legacy
 * messages parse. Returns `null` for anything else — the caller then renders the text as-is.
 *
 * @param messageText The full text of a user message part.
 * @returns The parsed attachments + remaining user text, or `null` when there is no preamble.
 */
export declare function parseAttachmentPreamble(messageText: string): IParsedAttachmentPreamble | null;
