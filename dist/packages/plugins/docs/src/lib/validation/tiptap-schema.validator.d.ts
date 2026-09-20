/**
 * The node types of the `gz-document-editor` schema and the attribute keys each one may carry.
 *
 * `uploadId` (image, fileAttachment) is the **transient** upload marker of `05` §6.6. The client
 * strips it in `sanitizeContentJson()` before saving, so it should never arrive — it is tolerated
 * rather than rejected so that a stale client tab cannot 400 every one of its autosaves, and it is
 * dropped on the way into storage (see `stripTransientAttributes`).
 */
export declare const DOCS_SCHEMA_NODES: Readonly<Record<string, readonly string[]>>;
/**
 * The mark types of the schema and the attribute keys each one may carry. `textStyle` carries the
 * `TextStyleKit` global attributes (Color, BackgroundColor, FontFamily, FontSize, LineHeight).
 */
export declare const DOCS_SCHEMA_MARKS: Readonly<Record<string, readonly string[]>>;
/**
 * Validates a canonical TipTap document and returns it.
 *
 * The root must be a `doc` node — that is what the editor loads and what
 * `@tiptap/static-renderer` renders; anything else would be unloadable content persisted as if it
 * were fine.
 *
 * @param value The `contentJson` payload as it arrived.
 * @returns The same value, typed, once it is proven schema-valid.
 * @throws BadRequestException `DOCS_CONTENT_SCHEMA_INVALID` on the first violation found.
 */
export declare function validateTiptapDocument(value: unknown): Record<string, unknown>;
/**
 * Removes the transient editor-only attributes (`uploadId`) from a validated document.
 *
 * The client already does this before saving; doing it again server-side is what makes it a
 * guarantee of the stored row rather than a client convention.
 *
 * @param value A schema-valid document.
 * @returns A copy with every transient attribute dropped.
 */
export declare function stripTransientAttributes<T>(value: T): T;
/**
 * Collects the ids of every `documentMention` node in a validated document (`05` §7.2).
 *
 * @param value A schema-valid document (or any subtree of one).
 * @returns The deduplicated, non-empty mentioned document ids in document order.
 */
export declare function collectDocumentMentionIds(value: unknown): string[];
