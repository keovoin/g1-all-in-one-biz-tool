import { type ReactNode } from 'react';
import { type DashboardLayout } from '../../hooks/use-dashboard-layout';
import { type LayoutItemState } from '../../utils/layout.utils';
/** Which of the two Angular layouts this mirrors (`ga-widget-layout` / `ga-window-layout`). */
export type DraggableLayoutKind = 'widget' | 'window';
export interface DraggableLayoutProps {
    kind: DraggableLayoutKind;
    layout: DashboardLayout;
    /**
     * Renders the card of one item; return `null` to render nothing for it (permission-gated
     * items). The wrapper, ⋮ menu and drag handling are added around it.
     */
    renderItem: (item: LayoutItemState) => ReactNode;
}
/**
 * The drag & drop reorder + per-item ⋮ menu shared by the widget grid and the window masonry —
 * the React counterpart of `ga-widget-layout`/`ga-widget` and `ga-window-layout`/`ga-window`.
 *
 * Reordering uses native HTML5 drag & drop (no dependency): every visible item is a drag
 * source and a drop target, and dropping item A on item B moves A to B's index in the layout
 * (`moveItemInArray` semantics, like the CDK drop lists). The ⋮ menu offers Collapse / Expand
 * / Move / Delete exactly like the Angular popover; "Move" only flags the item (`.moved`,
 * `cursor: move`) — dragging is always possible, as with `cdkDrag`.
 */
export declare function DraggableLayout({ kind, layout, renderItem }: DraggableLayoutProps): import("react/jsx-runtime").JSX.Element;
