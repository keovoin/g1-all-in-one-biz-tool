import { type LayoutItemState } from '../utils/layout.utils';
/** Which persisted array the layout lives in (`Store.widgets` / `Store.windows`). */
export type DashboardLayoutKind = 'widgets' | 'windows';
export interface UseDashboardLayoutOptions {
    /**
     * Resolves the informational `title` Angular stores next to each entry (the rendered title
     * text). Optional; entries keep whatever title was stored otherwise.
     */
    getTitle?: (position: number) => string | undefined;
}
/** The layout API handed to the widget/window layouts and the Manage-widgets popover. */
export interface DashboardLayout {
    /** All items in display order (hidden ones included — the popover lists them). */
    items: LayoutItemState[];
    /** Visible items in display order. */
    visible: LayoutItemState[];
    isHidden: (position: number) => boolean;
    isAllHidden: boolean;
    /**
     * Live readers (stable identity) — read the layout as of NOW, including a mutation made in
     * the same tick, unlike `isHidden` / `isAllHidden` which reflect the last render. The fetch
     * gates use these so "show window → refetch it" sees the window as visible.
     */
    peekHidden: (position: number) => boolean;
    peekAllHidden: () => boolean;
    /** Hides one item (⋮ → Delete, auto-hide rules). No-op when already hidden. */
    hide: (position: number) => void;
    /** Shows one item. No-op when already visible. */
    show: (position: number) => void;
    /** Flips visibility (Manage-widgets checkmark rows). Returns the NEW hidden flag. */
    toggle: (position: number) => boolean;
    setCollapsed: (position: number, collapsed: boolean) => void;
    /** Reorders by display index (drag & drop). */
    move: (fromIndex: number, toIndex: number) => void;
    /** Restores the layout that preceded the last change (Manage-widgets "Undo"). */
    undo: () => void;
    canUndo: boolean;
}
/**
 * Persisted widget/window layout — the React counterpart of Angular's `WidgetService` /
 * `WindowService` + `LayoutPersistance` / `PersistanceTakers`.
 *
 * State (order, hidden, collapsed) is read from and written to `Store.widgets` / `Store.windows`
 * in the exact record shape the Angular services use, so the two dashboard flavours share one
 * layout. Every mutation snapshots the previous state (memento) and persists synchronously;
 * `undo()` pops a snapshot and persists it, like `undoDrag()`.
 *
 * @param kind `'widgets'` or `'windows'`.
 * @param count Number of items (6 for both Time Tracking layouts).
 * @param options Optional title resolver.
 */
export declare function useDashboardLayout(kind: DashboardLayoutKind, count: number, options?: UseDashboardLayoutOptions): DashboardLayout;
