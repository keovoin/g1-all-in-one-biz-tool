/**
 * Recognizes the authenticated inline-stream URL persisted as an embedded image's
 * `src` (spec 05 §6.6 step 5 — `/api/plugins/docs/documents/{id}/raw`).
 *
 * 🛑 That route sits behind `@Permissions(DOCS_READ)` and the JWT strategy reads the
 * token from the **Authorization header only**, so a bare `<img src>` — which the
 * browser issues with no header — always comes back 401 and every embedded image
 * renders broken. Both render paths therefore keep `/raw` as the *persisted* src and
 * swap in an object URL fetched through the authenticated `HttpClient`
 * (`image-node-view.component.ts` for the live editor, `document-static-view.component.ts`
 * for the read/print view). This helper is the one place that knows the URL shape.
 *
 * Deliberately free of any `@tiptap/*` or Angular import so both callers — and the
 * unit test — can use it without dragging a chunk along.
 */
/**
 * Extracts the document id an embedded image points at.
 *
 * @param src The image's `src` attribute, exactly as authored/persisted.
 * @returns The document id, or `null` when the src is not a Documents raw-stream URL
 *          (a blob preview still uploading, a `data:` URL, or an external image).
 */
export declare function parseRawDocumentId(src: string | null | undefined): string | null;
/** What an `image` node's attributes say about where its bytes come from. */
export interface IImageSource {
    /** Set when the bytes must be fetched through the authenticated client. */
    documentId: string | null;
    /** The src to bind directly meanwhile (or permanently, for an external image). */
    previewSrc: string | null;
    /** Stable identity of this decision — re-resolving is skipped while it is unchanged. */
    key: string;
}
/**
 * Decides how an `image` node should be rendered, from its attributes alone.
 *
 * `documentId` is preferred, but content that predates the attribute (or arrives from an
 * import) only carries the `/raw` src — reading the id back out of it keeps those images
 * working. Anything else is bound as-is: the blob preview of an in-flight upload, or an
 * external https image.
 *
 * @param attrs The node's attributes (`src`, `documentId`).
 * @returns The resolved source decision.
 */
export declare function resolveImageSource(attrs: Record<string, unknown> | null | undefined): IImageSource;
