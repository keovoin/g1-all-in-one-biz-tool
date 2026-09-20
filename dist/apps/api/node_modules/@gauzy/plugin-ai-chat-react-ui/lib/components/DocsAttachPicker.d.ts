/** The subset of a document this picker needs. */
export interface IAttachableDocument {
    id: string;
    name: string;
    kind?: string;
    mimeType?: string;
    updatedAt?: string;
}
export interface DocsAttachPickerProps {
    /** API origin, e.g. `environment.API_BASE_URL`. */
    apiBaseUrl: string;
    /** Auth + tenant headers for the request (the panel already builds these for every call). */
    headers: () => Record<string, string>;
    /**
     * Tenant/organization scope for the QUERY. The docs list endpoint validates a `where` object
     * (`where[organizationId]` is required) — the Tenant-Id/Organization-Id headers do not satisfy
     * it, and flat `organizationId` params are whitelisted away. Without this the endpoint answers
     * 400 for every request, which the first version of this picker misreported as "Documents are
     * not available in this workspace".
     */
    scope: () => {
        organizationId?: string;
        tenantId?: string;
    };
    /** The user chose a document. */
    onPick: (document: IAttachableDocument) => void;
    /** Dismiss without choosing. */
    onClose: () => void;
    /** `t(key, fallback)` from the panel. */
    translate?: (key: string, fallback: string) => string;
}
/**
 * DocsAttachPicker
 *
 * "Attach from Documents": a compact search-and-pick list over the Documents hub, so a user can
 * point the assistant at a document that is ALREADY in the workspace instead of re-uploading it.
 *
 * Reads `GET /api/plugins/docs/documents`, the hub's own list endpoint, with the caller's own
 * JWT — so the picker can only ever show documents that user is allowed to read, and there is no
 * second authorization path to keep in sync. Folders are excluded: a folder has nothing the
 * assistant can read.
 *
 * A picked document is attached BY ID, which is what makes it useful: the chat's `docs_read`
 * tool takes a document id, so the assistant can open exactly what the user pointed at rather
 * than searching for something with a similar name.
 */
export declare function DocsAttachPicker({ apiBaseUrl, headers, scope, onPick, onClose, translate }: DocsAttachPickerProps): import("react/jsx-runtime").JSX.Element;
