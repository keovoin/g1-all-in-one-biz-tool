import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
/**
 * Base64 is forbidden (spec 05 §6.6): cancels any transaction that would insert
 * an `image` node whose `src` is a `data:` URL. Pasted images therefore always
 * route through FileHandler as files; the server DTO validator re-rejects
 * `data:` URLs as defense in depth.
 */
export declare const base64GuardPluginKey: PluginKey<any>;
export declare const Base64Guard: Extension<any, any>;
/** `editorProps.transformPastedHTML` companion: strips `data:` image sources before parse. */
export declare function stripDataUrlImages(html: string): string;
