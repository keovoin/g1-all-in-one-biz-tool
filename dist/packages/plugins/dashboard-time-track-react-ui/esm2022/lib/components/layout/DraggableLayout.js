import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { Popover } from '@gauzy/ui-react-components';
import { useTranslation } from '@gauzy/ui-react';
import { NbIcon } from '../NbIcon';
const DND_MIME = 'application/x-gauzy-dashboard-item';
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
export function DraggableLayout({ kind, layout, renderItem }) {
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [overIndex, setOverIndex] = useState(null);
    const [movingPositions, setMovingPositions] = useState(() => new Set());
    const { t } = useTranslation();
    const indexOf = useCallback((position) => layout.items.findIndex((item) => item.position === position), [layout.items]);
    const onDragStart = useCallback((event, position) => {
        const index = indexOf(position);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData(DND_MIME, String(index));
        // Firefox needs some text payload to start a drag at all.
        event.dataTransfer.setData('text/plain', String(index));
        setDraggingIndex(index);
    }, [indexOf]);
    const onDragOver = useCallback((event, position) => {
        if (draggingIndex === null)
            return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const index = indexOf(position);
        setOverIndex((current) => (current === index ? current : index));
    }, [draggingIndex, indexOf]);
    const endDrag = useCallback((position) => {
        setDraggingIndex(null);
        setOverIndex(null);
        setMovingPositions((current) => {
            if (!current.has(position))
                return current;
            const next = new Set(current);
            next.delete(position);
            return next;
        });
    }, []);
    const onDrop = useCallback((event, position) => {
        event.preventDefault();
        const raw = event.dataTransfer.getData(DND_MIME) || event.dataTransfer.getData('text/plain');
        const from = raw ? Number(raw) : draggingIndex;
        const to = indexOf(position);
        if (from !== null && from !== undefined && Number.isInteger(from) && to >= 0)
            layout.move(from, to);
        endDrag(position);
    }, [draggingIndex, indexOf, layout, endDrag]);
    const setMoving = useCallback((position) => {
        setMovingPositions((current) => {
            const next = new Set(current);
            next.add(position);
            return next;
        });
    }, []);
    return (_jsx("div", { className: kind === 'widget' ? 'gz-rtt-widgets' : 'gz-rtt-windows', children: layout.visible.map((item) => {
            const content = renderItem(item);
            if (content === null || content === undefined || content === false)
                return null;
            const index = indexOf(item.position);
            const classes = [
                kind === 'widget' ? 'gz-rtt-widget' : 'gz-rtt-window',
                item.isCollapse ? 'collapsed' : 'expanded',
                movingPositions.has(item.position) ? 'moved' : '',
                draggingIndex === index ? 'gz-rtt-dragging' : '',
                overIndex === index && draggingIndex !== null && draggingIndex !== index ? 'gz-rtt-drag-over' : ''
            ]
                .filter(Boolean)
                .join(' ');
            return (_jsx("div", { className: kind === 'widget' ? 'gz-rtt-widget-drop' : 'gz-rtt-window-drop', children: _jsxs("div", { className: classes, draggable: true, onDragStart: (event) => onDragStart(event, item.position), onDragOver: (event) => onDragOver(event, item.position), onDragLeave: () => setOverIndex((current) => (current === index ? null : current)), onDrop: (event) => onDrop(event, item.position), onDragEnd: () => endDrag(item.position), children: [_jsx("span", { className: "gz-rtt-item-menu", children: _jsx(Popover, { placement: "bottom", content: _jsxs("div", { className: "gz-rtt-setting", children: [_jsxs("button", { type: "button", className: "gz-rtt-action", onClick: () => layout.setCollapsed(item.position, true), children: [_jsx("i", { className: "far fa-window-minimize" }), _jsx("span", { children: t('BUTTONS.COLLAPSE') })] }), _jsxs("button", { type: "button", className: "gz-rtt-action", onClick: () => layout.setCollapsed(item.position, false), children: [_jsx("i", { className: "fas fa-expand" }), _jsx("span", { children: t('BUTTONS.EXPAND') })] }), _jsxs("button", { type: "button", className: "gz-rtt-action", onClick: () => setMoving(item.position), children: [_jsx("i", { className: "fas fa-expand-arrows-alt" }), _jsx("span", { children: t('BUTTONS.MOVE') })] }), _jsxs("button", { type: "button", className: "gz-rtt-action", onClick: () => layout.hide(item.position), children: [_jsx("i", { className: "fas fa-times" }), _jsx("span", { children: t('BUTTONS.DELETE') })] })] }), children: _jsx("button", { type: "button", className: "gz-rtt-item-menu-btn", "aria-label": t('BUTTONS.MANAGE_WIDGET'), draggable: false, children: _jsx(NbIcon, { icon: "more-vertical-outline" }) }) }) }), content] }) }, item.position));
        }) }));
}
//# sourceMappingURL=DraggableLayout.js.map