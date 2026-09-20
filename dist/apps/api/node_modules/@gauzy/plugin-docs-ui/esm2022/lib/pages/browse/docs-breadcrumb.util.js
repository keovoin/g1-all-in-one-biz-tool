/**
 * Maps the `GET /documents/:id/path` response onto rendered crumbs.
 *
 * 🛑 Returns `null` — never `[]` — when the response is not usable, because the
 * caller treats `null` as "fall back to the locally cached chain" while an empty
 * array is a legitimate answer (a root-level folder has no ancestors) that must
 * NOT trigger the fallback: the local walk would produce a different, longer
 * trail for the same location.
 *
 * A segment with no `id` is redacted whether or not the server also set the flag
 * (`08-permissions-security.md` §3.2) — there is nothing to navigate to and no
 * name to show, so it is marked `restricted` either way and the template renders
 * `DOCS.BREADCRUMB.RESTRICTED` in its place.
 *
 * The chain is expected to end at `folderId` itself. When the server answers with
 * ancestors only, the current folder is appended from `nameOf` so the trail still
 * shows where the user is standing; if that name cannot be resolved the crumb is
 * left off rather than rendered blank.
 */
export function toDocsBreadcrumb(segments, folderId, nameOf) {
    if (!Array.isArray(segments))
        return null;
    const crumbs = segments.map((segment) => ({
        id: segment?.id ?? null,
        name: segment?.name ?? '',
        restricted: !!segment?.restricted || !segment?.id
    }));
    const last = crumbs[crumbs.length - 1];
    if (!last || String(last.id ?? '') !== String(folderId)) {
        const name = nameOf(folderId);
        if (name)
            crumbs.push({ id: folderId, name });
    }
    return crumbs;
}
//# sourceMappingURL=docs-breadcrumb.util.js.map