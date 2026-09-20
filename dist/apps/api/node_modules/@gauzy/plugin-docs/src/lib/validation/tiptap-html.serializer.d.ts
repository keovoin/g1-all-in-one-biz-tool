/**
 * Serializes a validated TipTap document into the derived `contentHtml` cache.
 *
 * @param contentJson A document already accepted by `validateTiptapDocument()`.
 * @returns The derived HTML (empty string for an empty document).
 */
export declare function generateDocumentHtml(contentJson: unknown): string;
