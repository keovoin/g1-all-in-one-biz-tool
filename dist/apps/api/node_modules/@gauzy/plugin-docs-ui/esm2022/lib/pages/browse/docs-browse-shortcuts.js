/**
 * Ancestors that own their keystrokes.
 *
 * Text entry is the obvious one — `u` in the search box must type a `u` — but
 * `tree-root` matters just as much: the sidebar maps F2/Delete/Ctrl+↑↓ itself,
 * and `.cdk-overlay-container` covers a dialog or context menu that has taken
 * focus.
 */
export const DOCS_BROWSE_SHORTCUT_SKIP_SELECTOR = [
    'input',
    'textarea',
    'select',
    '[contenteditable="true"]',
    '[contenteditable=""]',
    'tree-root',
    '.cdk-overlay-container'
].join(', ');
/**
 * Selector matching an overlay that is currently open.
 *
 * A context menu does not necessarily move focus, so the skip-selector above
 * cannot catch it from the event target alone — the page checks the document for
 * one of these before acting on a shortcut. Deliberately narrow: `nbTooltip`
 * also renders into the overlay container, and a hovered tooltip must not
 * disable the whole keyboard map.
 *
 * `.docs-bulk-popover` is the bulk bar's Tags / More panel. It renders inline
 * (not in the overlay container) and does not move focus, so without it `Esc`
 * would both close the popover AND clear the whole selection — the bulk bar
 * closes its own panel on `Esc` and the page must leave that keystroke alone.
 */
export const DOCS_BROWSE_OVERLAY_SELECTOR = 'nb-dialog-container, nb-context-menu, .docs-bulk-popover';
/**
 * DOM id of the free-text search box, as rendered by
 * `components/filter-bar/docs-filter-bar.component.html`.
 *
 * The `/` shortcut only moves focus, so it addresses the input by id rather than
 * reaching across component boundaries for a `@ViewChild` the filter bar does not
 * expose. Keep the two in step — a renamed id turns `/` into a silent no-op.
 */
export const DOCS_SEARCH_INPUT_ID = 'docs-filter-search';
/**
 * Maps a raw keydown to the browse action it requests, or `null` when the page
 * must keep its hands off the event.
 */
export function docsBrowseShortcutOf(event) {
    if (!event || event.defaultPrevented)
        return null;
    // Every modifier combination belongs to the browser or the OS: `Ctrl+V` is
    // paste, not "toggle the layout".
    if (event.ctrlKey || event.metaKey || event.altKey)
        return null;
    const target = event.target;
    if (typeof target?.closest === 'function' && target.closest(DOCS_BROWSE_SHORTCUT_SKIP_SELECTOR))
        return null;
    switch (event.key) {
        case '/':
            return 'search';
        case 'u':
        case 'U':
            return 'upload';
        case 'n':
        case 'N':
            return 'new';
        case 'v':
        case 'V':
            return 'toggle-view';
        case 'Escape':
            return 'dismiss';
        default:
            return null;
    }
}
//# sourceMappingURL=docs-browse-shortcuts.js.map