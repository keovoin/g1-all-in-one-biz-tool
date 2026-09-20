/**
 * Pure pre-parse fixups for legacy CKEditor 4 HTML (05-editor-spec.md §3.6).
 *
 * TipTap parses HTML through a strict schema — anything not covered by a registered
 * extension is silently dropped. This function rewrites the handful of legacy
 * constructs CKEditor emitted that the schema cannot parse directly, so the
 * `standard` preset round-trips stored content losslessly:
 *
 * - `<font color face>`            → `<span style="color: …; font-family: …">`
 * - deprecated `align` attribute   → `style="text-align: …"` promotion
 * - `<figure><img><figcaption>`    → image + caption paragraph
 * - `<p>&nbsp;</p>` spacer runs    → empty paragraphs
 * - editor-namespace artifacts     → stripped (`cke_*` classes, `data-cke-*`
 *                                    attributes, HTML comments)
 *
 * Runs client-side only (DOMParser); on the server the input is returned untouched —
 * SSR renders a sanitized `[innerHTML]` preview and never parses into the schema.
 */
export declare function normalizeLegacyHtml(html: string): string;
