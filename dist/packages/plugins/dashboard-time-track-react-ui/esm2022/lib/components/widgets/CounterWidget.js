import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../nebular-jsx';
import { CounterPoint, Spinner } from '@gauzy/ui-react-components';
/**
 * One counter card of the widget row — the `<nb-card [nbSpinner]><nb-card-body>` block each of
 * the six `gaWidgetTemplate`s renders: title (`.header-widget > .title`), figure (`.h1`) and the
 * `gauzy-counter-point` strip inside `.counter-container`.
 */
export function CounterWidget({ title, value, loading, total, counterValue, color, progress = false }) {
    return (_jsxs("nb-card", { children: [_jsxs("nb-card-body", { children: [_jsx("div", { className: "gz-rtt-header-widget", children: _jsx("div", { className: "gz-rtt-title title", children: title }) }), _jsx("div", { className: "h1", children: value }), _jsx("div", { className: "gz-rtt-counter-container", children: _jsx(CounterPoint, { total: total, value: counterValue, color: color, progress: progress }) })] }), _jsx(Spinner, { active: loading, status: "primary", size: "giant" })] }));
}
//# sourceMappingURL=CounterWidget.js.map