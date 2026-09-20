import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../nebular-jsx';
import { useTranslation } from '@gauzy/ui-react';
import { Avatar } from '@gauzy/ui-react-components';
import { dateFormat, durationFormat } from '../../utils/format.utils';
import { NbButton } from '../NbButton';
import { WindowCard } from './WindowCard';
/**
 * The Manual Time window (`gaWindowTemplate` #1): "View Report" + a Member / Project /
 * Duration / Date table.
 */
export function ManualTimeWindow({ manualTimes, loading, emptyMessage, dateFormatOptions, onViewReport, onOpenEmployee }) {
    const { t } = useTranslation();
    // The statistics hook hands over `null` while a request is in flight — normalise once.
    const rows = manualTimes ?? [];
    return (_jsxs(WindowCard, { title: t('TIMESHEET.MANUAL_TIME'), loading: loading, hasData: rows.length > 0, emptyMessage: emptyMessage, flexHeader: true, children: [_jsx("div", { className: "gz-rtt-custom-card-button", children: _jsx(NbButton, { appearance: "outline", status: "primary", size: "small", onClick: onViewReport, children: t('BUTTONS.VIEW_REPORT') }) }), _jsxs("nb-list", { children: [_jsx("nb-list-item", { children: _jsx("div", { className: "gz-rtt-w-100", children: _jsxs("div", { className: "gz-rtt-row gz-rtt-py-2 gz-rtt-font-weight-bold", children: [_jsx("div", { className: "gz-rtt-col-3", children: t('TIMESHEET.MEMBER') }), _jsx("div", { className: "gz-rtt-col", children: t('TIMESHEET.PROJECT') }), _jsx("div", { className: "gz-rtt-col", children: t('TIMESHEET.DURATION') }), _jsx("div", { className: "gz-rtt-col", children: t('TIMESHEET.DATE') })] }) }) }), rows.map((manualTime) => (_jsx("nb-list-item", { children: _jsx("div", { className: "gz-rtt-w-100", children: _jsxs("div", { className: "gz-rtt-row", children: [_jsx("div", { className: "gz-rtt-col-3", children: _jsx(Avatar, { size: "sm", name: manualTime.user?.name, src: manualTime.user?.imageUrl, presence: manualTime.employee, onClick: manualTime.employeeId ? () => onOpenEmployee(manualTime.employeeId) : undefined }) }), _jsx("div", { className: "gz-rtt-col gz-rtt-project-name", children: manualTime.project?.name }), _jsx("div", { className: "gz-rtt-col", children: durationFormat(manualTime.duration) }), _jsx("div", { className: "gz-rtt-col", children: dateFormat(manualTime.startedAt, dateFormatOptions) })] }) }) }, manualTime.id)))] })] }));
}
//# sourceMappingURL=ManualTimeWindow.js.map