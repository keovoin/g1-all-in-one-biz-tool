import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
/**
 * Base64 is forbidden (spec 05 §6.6): cancels any transaction that would insert
 * an `image` node whose `src` is a `data:` URL. Pasted images therefore always
 * route through FileHandler as files; the server DTO validator re-rejects
 * `data:` URLs as defense in depth.
 */
export const base64GuardPluginKey = new PluginKey('gzBase64Guard');
const containsDataUrlImage = (fragment) => {
    let found = false;
    fragment?.descendants?.((node) => {
        if (node.type.name === 'image' && typeof node.attrs['src'] === 'string' && node.attrs['src'].startsWith('data:')) {
            found = true;
        }
    });
    return found;
};
export const Base64Guard = Extension.create({
    name: 'base64Guard',
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: base64GuardPluginKey,
                filterTransaction(transaction) {
                    if (!transaction.docChanged)
                        return true;
                    for (const step of transaction.steps) {
                        const slice = step.slice;
                        if (slice && containsDataUrlImage(slice.content))
                            return false;
                    }
                    return true;
                }
            })
        ];
    }
});
/** `editorProps.transformPastedHTML` companion: strips `data:` image sources before parse. */
export function stripDataUrlImages(html) {
    return html.replace(/<img[^>]*src=["']data:[^"']*["'][^>]*>/gi, '');
}
//# sourceMappingURL=base64-guard.plugin.js.map