"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePopoverPosition = computePopoverPosition;
exports.Popover = Popover;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const inject_styles_1 = require("../helpers/inject-styles");
const POPOVER_CSS = `
.gzrc-popover-panel { position: fixed; box-sizing: border-box; max-width: calc(100vw - 16px);
	background: var(--popover-background-color); color: var(--popover-text-color);
	border: var(--popover-border-width) solid var(--popover-border-color); border-radius: var(--popover-border-radius);
	box-shadow: var(--popover-shadow); font-family: var(--popover-text-font-family); font-size: var(--popover-text-font-size);
	font-weight: var(--popover-text-font-weight); line-height: var(--popover-text-line-height); }
.gzrc-popover-arrow { position: absolute; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; }
.gzrc-popover-panel[data-placement^="bottom"] .gzrc-popover-arrow { top: -8px; border-bottom: 8px solid var(--popover-border-color); }
.gzrc-popover-panel[data-placement^="bottom"] .gzrc-popover-arrow::after { content: ''; position: absolute; left: -8px; top: 1px;
	border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid var(--popover-background-color); }
.gzrc-popover-panel[data-placement="top"] .gzrc-popover-arrow { bottom: -8px; border-top: 8px solid var(--popover-border-color); }
.gzrc-popover-panel[data-placement="top"] .gzrc-popover-arrow::after { content: ''; position: absolute; left: -8px; bottom: 1px;
	border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid var(--popover-background-color); }
`;
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
function computePopoverPosition(trigger, panel, viewport, placement, offset) {
    const margin = 8;
    const triggerCenter = trigger.left + trigger.width / 2;
    let left;
    switch (placement) {
        case 'bottom-start':
            left = trigger.left;
            break;
        case 'bottom-end':
            left = trigger.left + trigger.width - panel.width;
            break;
        default:
            left = triggerCenter - panel.width / 2;
    }
    left = Math.max(margin, Math.min(left, viewport.width - panel.width - margin));
    const top = placement === 'top'
        ? Math.max(margin, trigger.top - panel.height - offset)
        : Math.min(trigger.top + trigger.height + offset, Math.max(margin, viewport.height - panel.height - margin));
    const arrowLeft = Math.max(12, Math.min(triggerCenter - left, panel.width - 12));
    return { top, left, arrowLeft };
}
/**
 * Popover — click-toggled floating panel in the style of `[nbPopover]`.
 *
 * The panel is portaled to `document.body` and positioned `fixed`, so it is never clipped by an
 * `overflow: hidden` card. It closes on outside click and on Escape; both go through
 * `onOpenChange`, so a consumer that persists state "when the popover closes" (the Angular
 * widgets save their layout on `clickOutside`) can hook there.
 */
function Popover({ children, content, placement = 'bottom', open, onOpenChange, offset = 8, className, panelClassName, panelStyle, display = 'inline-flex', zIndex = 1000, panelLabel }) {
    (0, inject_styles_1.useInjectedStyles)('gzrc-popover-styles', POPOVER_CSS);
    const [uncontrolledOpen, setUncontrolledOpen] = (0, react_1.useState)(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? !!open : uncontrolledOpen;
    const triggerRef = (0, react_1.useRef)(null);
    const panelRef = (0, react_1.useRef)(null);
    const [position, setPosition] = (0, react_1.useState)(null);
    const setOpen = (0, react_1.useCallback)((next) => {
        if (!isControlled)
            setUncontrolledOpen(next);
        onOpenChange?.(next);
    }, [isControlled, onOpenChange]);
    const reposition = (0, react_1.useCallback)(() => {
        const trigger = triggerRef.current;
        const panel = panelRef.current;
        if (!trigger || !panel)
            return;
        const rect = trigger.getBoundingClientRect();
        const next = computePopoverPosition(rect, { width: panel.offsetWidth, height: panel.offsetHeight }, { width: window.innerWidth, height: window.innerHeight }, placement, offset);
        setPosition((prev) => prev && prev.top === next.top && prev.left === next.left && prev.arrowLeft === next.arrowLeft ? prev : next);
    }, [placement, offset]);
    (0, react_1.useLayoutEffect)(() => {
        if (!isOpen) {
            setPosition(null);
            return;
        }
        reposition();
    }, [isOpen, reposition, content]);
    // Decide AFTER mount whether the caller rendered a real control (button, link, input…) — the
    // ref is null during the first render — and publish the disclosure state on THAT control,
    // which is what receives focus; the wrapper only takes over for a non-interactive child.
    const [interactiveChild, setInteractiveChild] = (0, react_1.useState)(true);
    (0, react_1.useLayoutEffect)(() => {
        const control = findInteractiveChild(triggerRef.current);
        setInteractiveChild(!!control);
        if (control) {
            control.setAttribute('aria-haspopup', 'dialog');
            control.setAttribute('aria-expanded', String(isOpen));
        }
    }, [children, isOpen]);
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        const onPointerDown = (event) => {
            const target = event.target;
            if (triggerRef.current?.contains(target) || panelRef.current?.contains(target))
                return;
            setOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', reposition);
        window.addEventListener('scroll', reposition, true);
        return () => {
            document.removeEventListener('mousedown', onPointerDown, true);
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', reposition);
            window.removeEventListener('scroll', reposition, true);
        };
    }, [isOpen, reposition, setOpen]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { ref: triggerRef, className: className, style: { display }, "aria-haspopup": interactiveChild ? undefined : 'dialog', "aria-expanded": interactiveChild ? undefined : isOpen, onClick: () => setOpen(!isOpen), onKeyDown: (event) => {
                    if (event.target !== event.currentTarget)
                        return;
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setOpen(!isOpen);
                    }
                }, tabIndex: interactiveChild ? undefined : 0, role: interactiveChild ? undefined : 'button', children: children }), isOpen && typeof document !== 'undefined'
                ? (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("div", { ref: panelRef, className: `gzrc-popover-panel${panelClassName ? ` ${panelClassName}` : ''}`, "data-placement": placement, role: "dialog", "aria-label": panelLabel, style: {
                        top: position?.top ?? 0,
                        left: position?.left ?? 0,
                        visibility: position ? 'visible' : 'hidden',
                        zIndex,
                        ...panelStyle
                    }, children: [(0, jsx_runtime_1.jsx)("span", { className: "gzrc-popover-arrow", style: { left: (position?.arrowLeft ?? 0) - 8 } }), content] }), document.body)
                : null] }));
}
/** The first natively focusable control (button, link, input…) inside the trigger wrapper, if any. */
function findInteractiveChild(element) {
    return element?.querySelector('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? null;
}
//# sourceMappingURL=Popover.js.map