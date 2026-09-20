import { type CSSProperties, type ReactNode } from 'react';
export type PopoverPlacement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top';
export interface PopoverProps {
    /** The trigger; clicking it toggles the panel (Nebular `nbPopoverTrigger="click"`). */
    children: ReactNode;
    /** Panel content. */
    content: ReactNode;
    placement?: PopoverPlacement;
    /** Controlled open state; omit for uncontrolled. */
    open?: boolean;
    /** Fired on every open/close, including outside clicks and Escape. */
    onOpenChange?: (open: boolean) => void;
    /** Gap between trigger and panel, in px (Nebular's arrow size). */
    offset?: number;
    /** Class applied to the trigger wrapper. */
    className?: string;
    /** Class applied to the floating panel. */
    panelClassName?: string;
    panelStyle?: CSSProperties;
    /** Trigger wrapper display; `inline-flex` by default so it hugs a button. */
    display?: CSSProperties['display'];
    /** z-index of the floating panel; defaults to Nebular's overlay level. */
    zIndex?: number;
    /**
     * Accessible name of the panel (`aria-label` on the `dialog`). Give one whenever the panel is
     * not self-describing — screen readers announce it when focus moves in.
     */
    panelLabel?: string;
}
interface PanelPosition {
    top: number;
    left: number;
    arrowLeft: number;
}
/**
 * Computes the fixed-position coordinates of a panel anchored to a trigger rectangle.
 *
 * Pure so it can be unit-tested: `bottom` centres the panel under the trigger, `bottom-start` /
 * `bottom-end` align its edges, `top` centres it above; the result is clamped to the viewport
 * with an 8px margin and the arrow keeps pointing at the trigger centre.
 *
 * @param trigger Trigger `DOMRect`-like box.
 * @param panel Panel width/height.
 * @param viewport Viewport width/height.
 * @param placement Requested placement.
 * @param offset Gap between trigger and panel.
 */
export declare function computePopoverPosition(trigger: {
    top: number;
    left: number;
    width: number;
    height: number;
}, panel: {
    width: number;
    height: number;
}, viewport: {
    width: number;
    height: number;
}, placement: PopoverPlacement, offset: number): PanelPosition;
/**
 * Popover — click-toggled floating panel in the style of `[nbPopover]`.
 *
 * The panel is portaled to `document.body` and positioned `fixed`, so it is never clipped by an
 * `overflow: hidden` card. It closes on outside click and on Escape; both go through
 * `onOpenChange`, so a consumer that persists state "when the popover closes" (the Angular
 * widgets save their layout on `clickOutside`) can hook there.
 */
export declare function Popover({ children, content, placement, open, onOpenChange, offset, className, panelClassName, panelStyle, display, zIndex, panelLabel }: PopoverProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Popover.d.ts.map