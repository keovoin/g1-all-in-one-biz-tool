import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../nebular-jsx';
import { useTranslation } from '@gauzy/ui-react';
import { Avatar, Badge, progressStatus } from '@gauzy/ui-react-components';
import { durationFormat } from '../../utils/format.utils';
import { RangePeriod } from '../../utils/period.utils';
import { WindowCard } from './WindowCard';
/**
 * The Members window (`gaWindowTemplate` #5): Member info / Today / This week|Over period table
 * with duration + activity badge per cell and the 7-bar weekly graph.
 */
export function MembersWindow({ members, loading, emptyMessage, selectedPeriod, moreThanWeek, onOpenEmployee }) {
    const { t } = useTranslation();
    // The statistics hook hands over `null` while a request is in flight — normalise once.
    const rows = members ?? [];
    return (_jsx(WindowCard, { title: t('TIMESHEET.MEMBERS'), loading: loading, hasData: rows.length > 0, emptyMessage: emptyMessage, className: "gz-rtt-member-list", emptyInBody: true, children: _jsx("div", { className: "gz-rtt-list", children: _jsxs("nb-list", { children: [_jsx("nb-list-item", { children: _jsx("div", { className: "gz-rtt-w-100", children: _jsxs("div", { className: "gz-rtt-row gz-rtt-font-weight-bold", children: [_jsx("div", { className: "gz-rtt-col-3", children: t('TIMESHEET.MEMBER_INFO') }), _jsx("div", { className: "gz-rtt-col-3 gz-rtt-text-center", children: t('TIMESHEET.TODAY') }), _jsx("div", { className: "gz-rtt-col gz-rtt-text-left", children: t(selectedPeriod === RangePeriod.PERIOD ? 'TIMESHEET.OVER_PERIOD' : 'TIMESHEET.THIS_WEEK') })] }) }) }), rows.map((member) => {
                        const todayOverall = member.todayTime?.overall || 0;
                        const weekOverall = member.weekTime?.overall || 0;
                        return (_jsx("nb-list-item", { children: _jsx("div", { className: "gz-rtt-w-100", children: _jsxs("div", { className: "gz-rtt-row", children: [_jsx("div", { className: "gz-rtt-col-3", children: _jsx(Avatar, { size: "sm", name: member.user?.name, src: member.user?.imageUrl, presence: member, onClick: member.id ? () => onOpenEmployee(member.id) : undefined }) }), _jsx("div", { className: "gz-rtt-col-3 gz-rtt-text-center", children: _jsxs("div", { className: "gz-rtt-activity", children: [_jsx("div", { className: "gz-rtt-duration", children: durationFormat(member.todayTime?.duration || 0) }), _jsx("div", { className: "gz-rtt-activity-percentage", children: _jsx(Badge, { status: progressStatus(todayOverall), text: `${todayOverall}%` }) })] }) }), _jsx("div", { className: "gz-rtt-col gz-rtt-text-center", children: _jsxs("div", { className: moreThanWeek ? undefined : 'gz-rtt-d-flex', children: [_jsxs("div", { className: "gz-rtt-activity gz-rtt-text-center", children: [_jsx("div", { className: "gz-rtt-duration", children: durationFormat(member.weekTime?.duration || 0) }), _jsx("div", { className: "gz-rtt-activity-percentage", children: _jsx(Badge, { status: progressStatus(weekOverall), text: `${weekOverall}%` }) })] }), !moreThanWeek ? (_jsx("div", { className: "gz-rtt-member-weekly-activity-graph", children: (member.weekHours || []).map((weekHour, index) => (_jsx("div", { className: "gz-rtt-bar-graph-entry", style: { height: `${weekHour.duration}%` } }, index))) })) : null] }) })] }) }) }, member.id));
                    })] }) }) }));
}
//# sourceMappingURL=MembersWindow.js.map