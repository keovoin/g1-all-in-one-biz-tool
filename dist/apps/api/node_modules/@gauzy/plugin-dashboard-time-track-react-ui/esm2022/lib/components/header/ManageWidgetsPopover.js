import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from '@gauzy/ui-react';
import { Popover } from '@gauzy/ui-react-components';
import { NbButton } from '../NbButton';
import { NbIcon } from '../NbIcon';
/**
 * The "Manage widgets ⋮" button + its popover (`#widgetManager`): "View widgets" and "View
 * windows" categories, each with an Undo button and one checkmark row per item, in display
 * order and including hidden items.
 */
export function ManageWidgetsPopover({ widgets, windows, widgetTitle, windowTitle, onWidgetToggled, onWindowToggled }) {
    const { t } = useTranslation();
    const renderCategory = (labelKey, layout, titleOf, onToggled) => (_jsxs("div", { className: "gz-rtt-category", children: [_jsxs("div", { className: "gz-rtt-view", children: [t(labelKey), _jsxs(NbButton, { className: "gz-rtt-manage-widget gz-rtt-undo", status: "basic", onClick: () => layout.undo(), disabled: !layout.canUndo, children: [_jsx("i", { className: "fas fa-undo" }), t('REACT_UI.BUTTONS.UNDO')] })] }), layout.items.map((item) => (_jsxs("button", { type: "button", className: "gz-rtt-title", "aria-pressed": !item.hide, onClick: () => onToggled(item, layout.toggle(item.position)), children: [_jsx("i", { className: "fas fa-check", style: { visibility: item.hide ? 'hidden' : 'visible' } }), _jsx("div", { children: titleOf(item.position) })] }, item.position)))] }));
    return (_jsx(Popover, { placement: "bottom", content: _jsxs("div", { className: "gz-rtt-widget-popover", children: [renderCategory('TIMESHEET.VIEW_WIDGETS', widgets, widgetTitle, onWidgetToggled), _jsx("div", { className: "gz-rtt-line" }), renderCategory('TIMESHEET.VIEW_WINDOWS', windows, windowTitle, onWindowToggled)] }), children: _jsxs(NbButton, { className: "gz-rtt-manage-widget", size: "small", status: "basic", "aria-haspopup": "dialog", children: [t('BUTTONS.MANAGE_WIDGET'), _jsx(NbIcon, { icon: "more-vertical-outline" })] }) }));
}
//# sourceMappingURL=ManageWidgetsPopover.js.map