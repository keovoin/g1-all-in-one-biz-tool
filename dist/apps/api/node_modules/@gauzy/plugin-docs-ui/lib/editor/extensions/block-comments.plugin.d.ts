import { Editor, Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
/**
 * Block-comment markers (spec 05 §8).
 *
 * Comments are core `Comment` rows anchored to the UniqueID `blockId`; this extension is the
 * editor-side half: it decorates every block that has an **open** thread with a gutter marker
 * and a class, and the marker opens that thread in the page's Comments rail. It holds no
 * comment data of its own — the rail owns the fetch and pushes the anchor set in with
 * `setCommentedBlocks()`, so there is exactly one source of truth for "which blocks have
 * comments" and no second request.
 */
/** Carries the open-anchor set both as plugin state and as the transaction meta that sets it. */
export declare const blockCommentsPluginKey: PluginKey<string[]>;
/** The attribute UniqueID is configured to write (`document-extensions.ts`). */
export declare const BLOCK_ID_ATTRIBUTE = "blockId";
export interface IBlockCommentsOptions {
    /** Invoked when a gutter marker is activated. */
    onOpenThread: (blockId: string) => void;
    /** Accessible name for the marker button — resolved by the caller (this file has no i18n). */
    markerLabel: string;
}
/**
 * The `blockId` of the innermost block containing the selection.
 *
 * Walks outwards from the selection head so a caret inside a list item or a table cell
 * anchors to the nearest block that actually carries an id, rather than failing because the
 * deepest node is a text node with no attributes.
 *
 * @param editor The live editor.
 * @returns The block id, or `null` when nothing in the ancestor chain has one.
 */
export declare function enclosingBlockId(editor: Editor | null | undefined): string | null;
/**
 * Every `blockId` present in the document, in document order.
 *
 * The rail uses it to tell a live thread from a detached one — a comment whose block was
 * deleted stays readable but is flagged `DOCS.EDITOR.COMMENT.DETACHED` (spec 05 §8).
 */
export declare function collectBlockIds(editor: Editor | null | undefined): string[];
/**
 * Publishes the set of blocks with an open thread.
 *
 * Dispatched as transaction meta rather than written to a field: ProseMirror re-derives the
 * decorations from plugin state, so this is what makes a resolved comment's marker disappear
 * without touching the document (resolving must never mutate content — spec 05 §8).
 */
export declare function setCommentedBlocks(editor: Editor | null | undefined, blockIds: readonly string[]): void;
export declare const BlockComments: Extension<IBlockCommentsOptions, any>;
