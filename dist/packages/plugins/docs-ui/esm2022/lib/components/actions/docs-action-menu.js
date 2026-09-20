import { DocumentKindEnum, DocumentKnowledgeStatusEnum } from '@gauzy/contracts';
/** Documents whose knowledge state means "already in" — the menu then offers Exclude. */
const KNOWLEDGE_INCLUDED_STATUSES = new Set([
    DocumentKnowledgeStatusEnum.QUEUED,
    DocumentKnowledgeStatusEnum.INDEXING,
    DocumentKnowledgeStatusEnum.INDEXED
]);
/** FOLDER and PAGE both hold children; FILE nodes are leaves. */
function isContainer(kind) {
    return kind !== DocumentKindEnum.FILE;
}
/**
 * Builds the permission-filtered action menu for one document.
 *
 * Order follows the spec table top-to-bottom, with the destructive items last.
 * The action id travels on `data.action`; read it back with {@link docsActionOf}
 * rather than matching on the (translated) title.
 */
export function buildDocsActionMenu(target, context) {
    const { permissions, translate, surface } = context;
    const items = [];
    const push = (action, key) => items.push({ title: translate(key), data: { action } });
    const container = isContainer(target.kind);
    const archived = !!target.isArchived;
    // Ownership half of the write rule (§1.7). Absent = permissive, so a caller that never
    // resolved it keeps the previous item set.
    const mutable = context.canMutate !== false;
    // ─── Open ────────────────────────────────────────────────────
    push('open', 'DOCS.TREE.OPEN');
    if (surface === 'row') {
        push('details', 'DOCS.PREVIEW.OPEN_DETAILS');
        if (target.kind === DocumentKindEnum.FILE)
            push('preview', 'DOCS.PREVIEW.TITLE');
    }
    // ─── Create inside ───────────────────────────────────────────
    // Only containers can take children, and an archived node is out of the
    // working set — creating into it would produce an invisible document.
    if (permissions.create && container && !archived) {
        push('new-page', 'DOCS.TREE.NEW_PAGE');
        push('new-folder', 'DOCS.TREE.NEW_FOLDER');
        push('upload-here', 'DOCS.TREE.UPLOAD_HERE');
    }
    // ─── Edit / relocate ─────────────────────────────────────────
    // `mutable` is the ownership half: `01-ux-spec.md` §3.5 offers these to a DOCS_UPDATE
    // holder, but §1.8 scopes edit and tree ops to **own** documents for everyone below ADMIN.
    if (permissions.update && mutable && !archived) {
        push('rename', 'DOCS.TREE.RENAME');
        push('move', 'DOCS.TREE.MOVE');
    }
    // Duplicating WRITES a new node: `POST /documents/:id/duplicate` is
    // `@Permissions(DOCS_CREATE)` (document-tree.controller.ts), so gating it on
    // DOCS_UPDATE offers the action to users the backend answers with a 403.
    if (permissions.create && !archived) {
        push('duplicate', 'DOCS.TREE.DUPLICATE');
        // The deep copy is the `{ deep: true }` body the endpoint has always
        // accepted and no UI ever sent (`01-ux-spec.md` §3.5, "with children option").
        if (container)
            push('duplicate-deep', 'DOCS.TREE.DUPLICATE_WITH_CHILDREN');
    }
    // ─── Read-only affordances (DOCS_READ, which every viewer holds) ──
    items.push({
        title: translate(context.isFavorite ? 'BUTTONS.REMOVE_FROM_FAVORITES' : 'BUTTONS.ADD_TO_FAVORITES'),
        data: { action: 'favorite' }
    });
    push('copy-link', 'DOCS.TREE.COPY_LINK');
    if (target.kind === DocumentKindEnum.FILE)
        push('download', 'DOCS.PREVIEW.DOWNLOAD');
    if (target.kind === DocumentKindEnum.PAGE)
        push('export-markdown', 'DOCS.EXPORT.MARKDOWN');
    // ─── AI knowledge (FOLDER has no body to index) ──────────────
    if (permissions.aiImport && target.kind !== DocumentKindEnum.FOLDER) {
        if (KNOWLEDGE_INCLUDED_STATUSES.has(target.knowledgeStatus)) {
            push('knowledge-exclude', 'DOCS.BULK.KNOWLEDGE_EXCLUDE');
        }
        else {
            push('knowledge-import', 'DOCS.BULK.KNOWLEDGE_IMPORT');
        }
    }
    // ─── Destructive, last ───────────────────────────────────────
    // Archive/unarchive and delete are both **own**-scoped below ADMIN (§1.8), so they carry
    // the ownership half too.
    if (permissions.update && mutable) {
        push(archived ? 'restore' : 'archive', archived ? 'DOCS.TREE.RESTORE' : 'DOCS.TREE.ARCHIVE');
    }
    // Archive-first rule: `DELETE /documents/:id` answers 409
    // `DOCS_DELETE_REQUIRES_ARCHIVE` for anything still live, so the item is
    // offered only where it can succeed.
    if (permissions.delete && mutable && archived) {
        push('delete', 'DOCS.TREE.DELETE');
    }
    return items;
}
/**
 * Narrows a list row to what the menu (and the executor) reads.
 *
 * `isArchived` and `childrenCount` are on the list projection but not on
 * `IDocument`, so they are read through an explicit widening rather than being
 * silently dropped — `childrenCount` is what decides whether the delete prompt
 * offers the subtree choice at all.
 */
export function toDocsActionTarget(row) {
    const projection = row;
    return {
        id: row.id,
        kind: row.kind,
        name: row.name,
        parentId: row.parentId ?? null,
        isArchived: projection.isArchived,
        knowledgeStatus: row.knowledgeStatus,
        childrenCount: projection.childrenCount
    };
}
/** Reads the action id back off a clicked `NbMenuItem`. */
export function docsActionOf(item) {
    return item?.data?.action;
}
/**
 * Cheap identity of everything the menu is derived from.
 *
 * `[nbContextMenu]` rebuilds its overlay whenever the bound array is a new
 * reference, so a builder called straight from a template binding would rebuild
 * it on every change-detection pass. Callers memoize on this signature.
 */
export function docsActionMenuSignature(target, context) {
    const { permissions } = context;
    return [
        String(target.id),
        target.kind,
        target.isArchived ? '1' : '0',
        target.knowledgeStatus ?? '',
        context.isFavorite ? '1' : '0',
        context.canMutate === false ? '0' : '1',
        context.surface,
        permissions.create ? '1' : '0',
        permissions.update ? '1' : '0',
        permissions.delete ? '1' : '0',
        permissions.aiImport ? '1' : '0'
    ].join('|');
}
//# sourceMappingURL=docs-action-menu.js.map