import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../nebular-jsx';
import { ProgressBar, progressStatus } from '@gauzy/ui-react-components';
import { durationFormat } from '../../utils/format.utils';
import { NbButton } from '../NbButton';
import { WindowCard } from './WindowCard';
/**
 * The Tasks (`gaWindowTemplate` #2) and Projects (#3) windows: name, `x%` + tiny progress bar,
 * duration — the same `nb-list` row both Angular templates render.
 */
export function PercentageListWindow({ title, rows, loading, emptyMessage, action }) {
    return (_jsxs(WindowCard, { title: title, loading: loading, hasData: rows.length > 0, emptyMessage: emptyMessage, flexHeader: !!action, children: [action ? (_jsx("div", { className: "gz-rtt-custom-card-button", children: _jsx(NbButton, { appearance: "outline", status: "primary", size: "small", onClick: action.onClick, children: action.label }) })) : null, _jsx("nb-list", { children: rows.map((row) => {
                    const percentage = row.durationPercentage ?? 0;
                    return (_jsx("nb-list-item", { children: _jsx("div", { className: "gz-rtt-w-100", children: _jsxs("div", { className: "gz-rtt-row gz-rtt-align-items-center", children: [_jsx("div", { className: "gz-rtt-col-5 gz-rtt-project-name gz-rtt-text-left", children: row.name }), _jsx("div", { className: "gz-rtt-col-4 gz-rtt-text-center", children: _jsxs("div", { className: "gz-rtt-percent-cell", children: [percentage, "%", _jsx(ProgressBar, { className: "gz-rtt-custom-progress", value: percentage, status: progressStatus(percentage), height: "5px" })] }) }), _jsx("div", { className: "gz-rtt-col gz-rtt-text-right", children: durationFormat(row.duration) })] }) }) }, row.id));
                }) })] }));
}
//# sourceMappingURL=PercentageListWindow.js.map