/**
 * Query params a saved view deliberately does NOT capture: they are per-visit
 * navigation state, not a "view".
 *
 * - `id` — which document's detail panel happens to be open
 * - `folder` — tree location (a view is meant to travel across folders)
 * - `page` — paging position
 * - `upload` / `newPage` — one-shot deep links that are stripped on arrival
 */
export const DOCS_SAVED_VIEW_EXCLUDED_PARAMS = ['id', 'folder', 'page', 'upload', 'newPage'];
/**
 * Params a saved view owns. Applying a view must *clear* every one of these that
 * the view does not carry, otherwise a leftover facet from the previous view
 * silently narrows the result set.
 */
export const DOCS_SAVED_VIEW_PARAMS = [
    'q',
    'searchIn',
    'preset',
    'kind',
    'status',
    'knowledge',
    'source',
    'categories',
    'tags',
    'createdFrom',
    'createdTo',
    'updatedFrom',
    'updatedTo',
    'sort',
    'pageSize',
    'view'
];
//# sourceMappingURL=docs-saved-view.model.js.map