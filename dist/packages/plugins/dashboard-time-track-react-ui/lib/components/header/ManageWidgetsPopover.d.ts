import { type DashboardLayout } from '../../hooks/use-dashboard-layout';
import { type LayoutItemState } from '../../utils/layout.utils';
export interface ManageWidgetsPopoverProps {
    widgets: DashboardLayout;
    windows: DashboardLayout;
    /** Translated title of a widget position (period-aware `titleMapper(pos, true)`). */
    widgetTitle: (position: number) => string;
    /** Translated title of a window position (`titleMapper(pos, false)`). */
    windowTitle: (position: number) => string;
    /** Fired after a widget's visibility flipped (`updateWidgetVisibility`). */
    onWidgetToggled: (item: LayoutItemState, hidden: boolean) => void;
    /** Fired after a window's visibility flipped (`updateWindowVisibility`). */
    onWindowToggled: (item: LayoutItemState, hidden: boolean) => void;
}
/**
 * The "Manage widgets ⋮" button + its popover (`#widgetManager`): "View widgets" and "View
 * windows" categories, each with an Undo button and one checkmark row per item, in display
 * order and including hidden items.
 */
export declare function ManageWidgetsPopover({ widgets, windows, widgetTitle, windowTitle, onWidgetToggled, onWindowToggled }: ManageWidgetsPopoverProps): import("react/jsx-runtime").JSX.Element;
