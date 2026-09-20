import { Schema } from '@tiptap/pm/model';
/**
 * `contentBinary` producer (spec 05 §9.1 storage table + §11 collaboration readiness).
 *
 * The column, the entity field, the version snapshot and the `yjs` / `y-protocols` /
 * `@tiptap/y-tiptap` dependencies have all existed since M1, but **no save path ever wrote
 * one** — the column was NULL on every row, so the M5 CRDT cutover would start from nothing
 * to migrate. Each content save now carries a Yjs update encoding the same JSON it persists,
 * which is exactly the seed state `prosemirrorJSONToYDoc` is documented for ("importing
 * existing content to a Y.Doc for the first time").
 *
 * 🛑 This is a *seed*, not a live CRDT log: once collaboration is on, the binary log becomes
 * canonical and must be rehydrated from storage, never re-derived from JSON (all history
 * would be lost). The M5 sync service therefore has to stop this write when it takes over.
 *
 * 🛑 `yjs` + `@tiptap/y-tiptap` are loaded through a **dynamic import**. A static import would
 * add them to the tier-2 editor chunk, which spec 05 §12 caps at 260 KB gz; this way they land
 * in their own chunk, fetched once in the background while the first edit is still being typed.
 */
/** Encodes a document's canonical JSON as a Yjs update. */
export interface ICrdtEncoder {
    encode(schema: Schema, contentJson: unknown): Uint8Array;
}
/**
 * Loads (once) the CRDT encoder chunk.
 *
 * Resolves to `null` when the chunk cannot be fetched — a content save must never fail
 * because a reserved, forward-looking column could not be filled in.
 */
export declare function loadCrdtEncoder(): Promise<ICrdtEncoder | null>;
/**
 * Encodes `contentJson` for the wire.
 *
 * @param encoder The loaded encoder, or `null` when the chunk is not ready yet.
 * @param schema The editor's ProseMirror schema — the JSON is parsed against it.
 * @param contentJson The canonical JSON being saved (already upload-sanitized).
 * @param maxBytes Cap on the raw update size, mirroring `GAUZY_DOCS_MAX_BINARY_BYTES`.
 * @returns Base64 of the Yjs update, or `null` when it is unavailable, empty or over the cap.
 */
export declare function encodeContentBinary(encoder: ICrdtEncoder | null, schema: Schema | null | undefined, contentJson: unknown, maxBytes?: number): string | null;
/**
 * Base64 for a byte array.
 *
 * Chunked: `String.fromCharCode(...bytes)` on a multi-megabyte update blows the argument
 * limit and throws `RangeError` — which, before this was chunked, would have surfaced as a
 * failed save rather than a skipped optional field.
 */
export declare function toBase64(bytes: Uint8Array): string;
