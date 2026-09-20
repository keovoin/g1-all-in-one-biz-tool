import { useCallback, useMemo, useRef, useState } from 'react';
import { Store } from '@gauzy/ui-core/core';
import { useInjector } from '@gauzy/ui-react';
import { isLayoutAllHidden, isLayoutItemHidden, LayoutHistory, moveLayoutItem, restoreLayout, serializeLayout, setLayoutCollapsed, setLayoutHidden } from '../utils/layout.utils';
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
export function useDashboardLayout(kind, count, options = {}) {
    const injector = useInjector();
    const store = useMemo(() => injector.get(Store), [injector]);
    const historyRef = useRef(new LayoutHistory());
    const [items, setItems] = useState(() => restoreLayout(store[kind], count));
    const itemsRef = useRef(items);
    itemsRef.current = items;
    const [historyVersion, setHistoryVersion] = useState(0);
    const getTitleRef = useRef(options.getTitle);
    getTitleRef.current = options.getTitle;
    /** Writes the given layout to the store in Angular's persisted shape. */
    const persist = useCallback((next) => {
        const serialized = serializeLayout(next, getTitleRef.current);
        if (kind === 'widgets')
            store.widgets = serialized;
        else
            store.windows = serialized;
    }, [store, kind]);
    /** Applies a pure transition; commits + persists only when it produced a new array. */
    const commit = useCallback((transition) => {
        const current = itemsRef.current;
        const next = transition(current);
        if (next === current)
            return;
        historyRef.current.backup(current);
        itemsRef.current = next;
        setItems(next);
        persist(next);
        setHistoryVersion((version) => version + 1);
    }, [persist]);
    const hide = useCallback((position) => commit((current) => setLayoutHidden(current, position, true)), [commit]);
    const show = useCallback((position) => commit((current) => setLayoutHidden(current, position, false)), [commit]);
    const toggle = useCallback((position) => {
        const nextHidden = !isLayoutItemHidden(itemsRef.current, position);
        commit((current) => setLayoutHidden(current, position, nextHidden));
        return nextHidden;
    }, [commit]);
    const setCollapsed = useCallback((position, collapsed) => commit((current) => setLayoutCollapsed(current, position, collapsed)), [commit]);
    const move = useCallback((from, to) => commit((current) => moveLayoutItem(current, from, to)), [commit]);
    const undo = useCallback(() => {
        const previous = historyRef.current.undo();
        if (!previous)
            return;
        itemsRef.current = previous;
        setItems(previous);
        persist(previous);
        setHistoryVersion((version) => version + 1);
    }, [persist]);
    const isHidden = useCallback((position) => isLayoutItemHidden(items, position), [items]);
    const peekHidden = useCallback((position) => isLayoutItemHidden(itemsRef.current, position), []);
    const peekAllHidden = useCallback(() => isLayoutAllHidden(itemsRef.current), []);
    const visible = useMemo(() => items.filter((item) => !item.hide), [items]);
    return useMemo(() => ({
        items,
        visible,
        isHidden,
        isAllHidden: isLayoutAllHidden(items),
        peekHidden,
        peekAllHidden,
        hide,
        show,
        toggle,
        setCollapsed,
        move,
        undo,
        // `historyVersion` is read only so `canUndo` re-evaluates after every commit/undo.
        canUndo: historyVersion >= 0 && historyRef.current.canUndo
    }), [items, visible, isHidden, peekHidden, peekAllHidden, hide, show, toggle, setCollapsed, move, undo, historyVersion]);
}
//# sourceMappingURL=use-dashboard-layout.js.map