import { DOCS_EDITOR_MAX_BINARY_BYTES } from '../editor.constants';
let encoderPromise = null;
/**
 * Loads (once) the CRDT encoder chunk.
 *
 * Resolves to `null` when the chunk cannot be fetched — a content save must never fail
 * because a reserved, forward-looking column could not be filled in.
 */
export function loadCrdtEncoder() {
    encoderPromise ??= Promise.all([import('yjs'), import('@tiptap/y-tiptap')])
        .then(([yjs, yTiptap]) => {
        const Y = yjs;
        const binding = yTiptap;
        return {
            encode: (schema, contentJson) => {
                const doc = binding.prosemirrorJSONToYDoc(schema, contentJson);
                try {
                    return Y.encodeStateAsUpdate(doc);
                }
                finally {
                    // The Y.Doc is a throwaway built for this one encode.
                    doc.destroy();
                }
            }
        };
    })
        .catch(() => null);
    return encoderPromise;
}
/**
 * Encodes `contentJson` for the wire.
 *
 * @param encoder The loaded encoder, or `null` when the chunk is not ready yet.
 * @param schema The editor's ProseMirror schema — the JSON is parsed against it.
 * @param contentJson The canonical JSON being saved (already upload-sanitized).
 * @param maxBytes Cap on the raw update size, mirroring `GAUZY_DOCS_MAX_BINARY_BYTES`.
 * @returns Base64 of the Yjs update, or `null` when it is unavailable, empty or over the cap.
 */
export function encodeContentBinary(encoder, schema, contentJson, maxBytes = DOCS_EDITOR_MAX_BINARY_BYTES) {
    if (!encoder || !schema || !contentJson)
        return null;
    try {
        const update = encoder.encode(schema, contentJson);
        // Over the cap the server would reject the whole save; drop the optional field instead.
        if (!update?.length || update.length > maxBytes)
            return null;
        return toBase64(update);
    }
    catch {
        // A schema the JSON does not parse against is a real possibility during a schema
        // migration — the JSON still saves, only the reserved binary is skipped.
        return null;
    }
}
/**
 * Base64 for a byte array.
 *
 * Chunked: `String.fromCharCode(...bytes)` on a multi-megabyte update blows the argument
 * limit and throws `RangeError` — which, before this was chunked, would have surfaced as a
 * failed save rather than a skipped optional field.
 */
export function toBase64(bytes) {
    const CHUNK = 0x8000;
    let binary = '';
    for (let index = 0; index < bytes.length; index += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK));
    }
    return btoa(binary);
}
//# sourceMappingURL=document-binary.util.js.map