/**
 * Pure state helpers behind `useDashboardLayout`.
 *
 * The persisted shape is the one the Angular `WidgetService` / `WindowService` write to
 * `Store.widgets` / `Store.windows` (localStorage `_widgets` / `_windows` via Akita persist):
 * an array of `{ position, hide, isCollapse, isExpand, title }` in DISPLAY order, where
 * `position` is the item's identity (its index in the default order, 0..n-1). Reading and
 * writing that exact shape is what lets a tenant flip Angular ↔ React and keep the layout.
 */
/** One widget/window entry of the layout, in display order. */
export interface LayoutItemState {
    /** Identity: index in the default order (0..count-1). */
    position: number;
    /** Hidden via the ⋮ "Delete" action, the Manage-widgets popover or an auto-hide rule. */
    hide: boolean;
    /** Collapsed (`isExpand` is always its inverse, kept for the persisted shape). */
    isCollapse: boolean;
    isExpand: boolean;
    /** Display title Angular stores (innerText of the widget title); informational only. */
    title?: string;
}
/** The persisted record (Angular `GuiDrag.toObject()`), all fields optional on read. */
export type PersistedLayoutItem = Partial<LayoutItemState>;
/**
 * The default layout: `count` items in positional order, visible and expanded.
 *
 * @param count Number of items.
 */
export declare function createDefaultLayout(count: number): LayoutItemState[];
/**
 * Restores a layout from whatever the store holds.
 *
 * Tolerant on purpose (this is user localStorage): non-arrays yield the default; entries with an
 * out-of-range or duplicate `position` are dropped; positions the store does not mention are
 * appended in default order (so a dashboard that grew a widget still shows it). Stored order
 * wins — it IS the display order.
 *
 * @param stored Raw value from `Store.widgets` / `Store.windows`.
 * @param count Number of items the dashboard has.
 */
export declare function restoreLayout(stored: unknown, count: number): LayoutItemState[];
/**
 * Serialises the layout into the Angular record shape (`GuiDrag.toObject()`), display order.
 *
 * @param items Current layout.
 * @param titleOf Optional resolver for the informational `title` (Angular stores the rendered
 * title text; the React dashboard passes the translated title).
 */
export declare function serializeLayout(items: LayoutItemState[], titleOf?: (position: number) => string | undefined): PersistedLayoutItem[];
/**
 * Moves the item at `from` to index `to` (CDK `moveItemInArray` semantics). Out-of-range or
 * identical indices return the same array instance.
 *
 * @param items Current layout.
 * @param from Source index (display order).
 * @param to Target index (display order).
 */
export declare function moveLayoutItem(items: LayoutItemState[], from: number, to: number): LayoutItemState[];
/**
 * Sets the hidden flag of one item by position; returns the same array when nothing changes.
 *
 * @param items Current layout.
 * @param position Item identity.
 * @param hide New flag.
 */
export declare function setLayoutHidden(items: LayoutItemState[], position: number, hide: boolean): LayoutItemState[];
/**
 * Sets the collapsed flag (and its `isExpand` mirror) of one item; same-array on no change.
 *
 * @param items Current layout.
 * @param position Item identity.
 * @param collapsed New flag.
 */
export declare function setLayoutCollapsed(items: LayoutItemState[], position: number, collapsed: boolean): LayoutItemState[];
/** True when the item with that position is hidden (unknown positions count as hidden). */
export declare function isLayoutItemHidden(items: LayoutItemState[], position: number): boolean;
/** True when every item is hidden (Angular `_isAllWidgetsHidden`). */
export declare function isLayoutAllHidden(items: LayoutItemState[]): boolean;
/**
 * Memento stack for undo — the React counterpart of Angular's `PersistanceTakers`.
 *
 * Snapshots are pushed BEFORE each mutation and popped by `undo()`; the stack is bounded so a
 * long session cannot grow it without limit.
 */
export declare class LayoutHistory {
    private readonly limit;
    private readonly snapshots;
    constructor(limit?: number);
    /** Records the state that a mutation is about to replace. */
    backup(items: LayoutItemState[]): void;
    /** Pops the most recent snapshot, or `undefined` when there is nothing to undo. */
    undo(): LayoutItemState[] | undefined;
    get canUndo(): boolean;
    get size(): number;
}
