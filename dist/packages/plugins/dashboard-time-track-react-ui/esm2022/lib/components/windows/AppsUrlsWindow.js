import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../nebular-jsx';
import { useTranslation } from '@gauzy/ui-react';
import { ProgressBar, progressStatus } from '@gauzy/ui-react-components';
import { durationFormat } from '../../utils/format.utils';
import { NbButton } from '../NbButton';
import { WindowCard } from './WindowCard';
/**
 * `ngx-activity-item [isDashboard]="true"` for one activity: title (5 cols), `x%` + tiny bar,
 * duration. The percentage is truncated to an integer like the Angular `item` setter
 * (`parseInt(...).toFixed(1)`).
 */
export function ActivityItem({ item }) {
    const percentage = parseFloat(parseInt(`${item.durationPercentage ?? 0}`, 10).toFixed(1)) || 0;
    return (_jsxs("div", { className: "gz-rtt-activity-item", children: [_jsx("div", { className: "gz-rtt-activity-title", title: item.title, children: item.title }), _jsxs("div", { className: "gz-rtt-activity-progress", children: [_jsxs("div", { className: "gz-rtt-percentage-col", children: [percentage, "%"] }), _jsx(ProgressBar, { className: "gz-rtt-tracking-progress", value: percentage, status: progressStatus(percentage), height: "5px" })] }), _jsx("div", { className: "gz-rtt-activity-duration", children: durationFormat(item.duration) })] }));
}
/**
 * The Apps & URLs window (`gaWindowTemplate` #4): "View Report" + one activity item per row.
 */
export function AppsUrlsWindow({ activities, loading, emptyMessage, onViewReport }) {
    const { t } = useTranslation();
    // The statistics hook hands over `null` while a request is in flight — normalise once.
    const rows = activities ?? [];
    return (_jsxs(WindowCard, { title: t('TIMESHEET.APPS_URLS'), loading: loading, hasData: rows.length > 0, emptyMessage: emptyMessage, flexHeader: true, children: [_jsx("div", { className: "gz-rtt-custom-card-button", children: _jsx(NbButton, { appearance: "outline", status: "primary", size: "small", onClick: onViewReport, children: t('BUTTONS.VIEW_REPORT') }) }), _jsx("nb-list", { children: rows.map((activity, index) => (_jsx("nb-list-item", { children: _jsx("div", { className: "gz-rtt-w-100", children: _jsx(ActivityItem, { item: activity }) }) }, `${activity.title ?? ''}-${index}`))) })] }));
}
//# sourceMappingURL=AppsUrlsWindow.js.map