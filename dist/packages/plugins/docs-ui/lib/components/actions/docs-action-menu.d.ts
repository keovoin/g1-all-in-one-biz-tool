import { NbMenuItem } from '@nebular/theme';
import { DocumentKindEnum, DocumentKnowledgeStatusEnum, ID, IDocument } from '@gauzy/contracts';
/**
 * Every action a document row can offer, in the tree context menu (`01-ux-spec.md`
 * §3.5) and the table/cards kebab (§4.1 column 9 / §4.2).
 *
 * 🛑 The three surfaces render the SAME list from {@link buildDocsActionMenu} —
 * writing the item set per surface is how the table ended up with no actions at
 * all while the tree offered six of the fourteen the spec asks for.
 */
export type DocsActionId = 'open' | 'details' | 'preview' | 'new-page' | 'new-folder' | 'upload-here' | 'rename' | 'move' | 'duplicate' | 'duplicate-deep' | 'favorite' | 'copy-link' | 'download' | 'export-markdown' | 'knowledge-import' | 'knowledge-exclude' | 'archive' | 'restore' | 'delete';
/**
 * The row/node the menu is built for. Deliberately structural rather than
 * `IDocument`: the tree carries `IDocsTreeNode`, the table/cards carry the list
 * projection, and both satisfy this shape.
 */
export interface IDocsActionTarget {
    id: ID;
    kind: DocumentKindEnum;
    name?: string;
    parentId?: ID | null;
    isArchived?: boolean;
    knowledgeStatus?: DocumentKnowledgeStatusEnum;
    /** Backend list projection (virtual column) — drives the delete subtree prompt. */
    childrenCount?: number;
}
/** Resolved permission flags (the caller reads them once from `NgxPermissionsService`/`Store`). */
export interface IDocsActionPermissions {
    create: boolean;
    update: boolean;
    delete: boolean;
    aiImport: boolean;
}
export interface IDocsActionMenuContext {
    permissions: IDocsActionPermissions;
    /** `getTranslation` of the calling component — labels re-translate on language change. */
    translate: (key: string) => string;
    /**
     * `'tree'` opens a node in place, so it offers a single "Open".
     * `'row'` is a content view: it adds "Details" (the side panel) and, for a
     * FILE, "Preview" — `01-ux-spec.md` §4.1 column 9.
     */
    surface: 'tree' | 'row';
    /** Star state; flips the label between Favorite and Unfavorite. */
    isFavorite?: boolean;
    /**
     * Row-level ownership scope from `DocumentPermissionService.canMutate()`
     * (`08-permissions-security.md` §1.7/§1.8) — `DOCS_MANAGE` holder or the document's own
     * creator.
     *
     * 🛑 Independent of `permissions.update`, exactly as on the server: the write rule is
     * `DOCS_UPDATE AND (DOCS_MANAGE OR creator OR EDIT share)`, so both halves have to hold.
     * Left `undefined` (a caller that has not resolved it yet) it defaults to permissive, which
     * keeps the pre-ownership behaviour rather than silently emptying a menu.
     */
    canMutate?: boolean;
}
/**
 * Builds the permission-filtered action menu for one document.
 *
 * Order follows the spec table top-to-bottom, with the destructive items last.
 * The action id travels on `data.action`; read it back with {@link docsActionOf}
 * rather than matching on the (translated) title.
 */
export declare function buildDocsActionMenu(target: IDocsActionTarget, context: IDocsActionMenuContext): NbMenuItem[];
/**
 * Narrows a list row to what the menu (and the executor) reads.
 *
 * `isArchived` and `childrenCount` are on the list projection but not on
 * `IDocument`, so they are read through an explicit widening rather than being
 * silently dropped — `childrenCount` is what decides whether the delete prompt
 * offers the subtree choice at all.
 */
export declare function toDocsActionTarget(row: IDocument): IDocsActionTarget;
/** Reads the action id back off a clicked `NbMenuItem`. */
export declare function docsActionOf(item: NbMenuItem | undefined): DocsActionId | undefined;
/**
 * Cheap identity of everything the menu is derived from.
 *
 * `[nbContextMenu]` rebuilds its overlay whenever the bound array is a new
 * reference, so a builder called straight from a template binding would rebuild
 * it on every change-detection pass. Callers memoize on this signature.
 */
export declare function docsActionMenuSignature(target: IDocsActionTarget, context: IDocsActionMenuContext): string;
