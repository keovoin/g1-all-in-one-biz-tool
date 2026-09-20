import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../nebular-jsx';
import { Spinner } from '@gauzy/ui-react-components';
/**
 * The `<nb-card [nbSpinner]><nb-card-header>…</nb-card-header>…</nb-card>` shell every window
 * template shares, including its loading veil and per-period empty state.
 */
export function WindowCard({ title, loading, hasData, emptyMessage, bodyClassName = 'gz-rtt-custom-card-body-inner-list', className, flexHeader = false, emptyInBody = false, children }) {
    const empty = !hasData && !loading ? _jsx("div", { className: "gz-rtt-empty gz-rtt-p-3", children: emptyMessage }) : null;
    return (_jsxs("nb-card", { className: className, children: [_jsx("nb-card-header", { className: flexHeader ? 'gz-rtt-nb-card-header' : undefined, children: title }), hasData ? _jsx("nb-card-body", { className: bodyClassName, children: children }) : null, !hasData && emptyInBody ? _jsx("nb-card-body", { className: bodyClassName, children: empty }) : null, !hasData && !emptyInBody ? empty : null, _jsx(Spinner, { active: loading, status: "primary", size: "giant" })] }));
}
//# sourceMappingURL=WindowCard.js.map