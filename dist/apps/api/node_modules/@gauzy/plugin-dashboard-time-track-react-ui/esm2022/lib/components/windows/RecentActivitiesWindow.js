import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useTranslation } from '@gauzy/ui-react';
import { Avatar } from '@gauzy/ui-react-components';
import { dateFormat, utcToLocal } from '../../utils/format.utils';
import { NbButton } from '../NbButton';
import { ScreenshotCarousel } from './ScreenshotCarousel';
import { ScreenshotItem } from './ScreenshotItem';
import { WindowCard } from './WindowCard';
/**
 * One employee row of the Recent Activities window: avatar + "Last worked" caption, prev/next
 * arrows, "View All", and the three-per-view screenshot carousel.
 */
function EmployeeActivityRow({ employee, timeZone, timeFormat, organization, dateFormatOptions, canChangeSelectedEmployee, onViewAll, onOpenEmployee, onDelete }) {
    const { t } = useTranslation();
    const carouselRef = useRef(null);
    const firstSlot = employee.timeSlots?.[0];
    const lastWorked = firstSlot?.startedAt ? dateFormat(utcToLocal(firstSlot.startedAt), dateFormatOptions) : '';
    return (_jsx("div", { className: "gz-rtt-row", children: _jsxs("div", { className: "gz-rtt-col", children: [_jsxs("div", { className: "gz-rtt-hour-label gz-rtt-mb-3 gz-rtt-avatar-row", children: [canChangeSelectedEmployee ? (_jsx(Avatar, { variant: "activity", size: "sm", name: employee.user?.name, src: employee.user?.imageUrl, appendCaption: t('TIMESHEET.LAST_WORKED'), caption: lastWorked, presence: employee, onClick: () => onOpenEmployee(employee.id) })) : (_jsx("div", {})), _jsxs("div", { className: "gz-rtt-button-container", children: [_jsxs("div", { className: "gz-rtt-swiper-button-container", children: [_jsx("button", { type: "button", className: "gz-rtt-swiper-button", "aria-label": t('BUTTONS.PREVIOUS'), onClick: () => carouselRef.current?.slidePrev(), children: _jsx("i", { className: "fas fa-angle-left" }) }), _jsx("button", { type: "button", className: "gz-rtt-swiper-button", "aria-label": t('BUTTONS.NEXT'), onClick: () => carouselRef.current?.slideNext(), children: _jsx("i", { className: "fas fa-angle-right" }) })] }), canChangeSelectedEmployee ? (_jsx("div", { className: "gz-rtt-view-all", children: _jsx(NbButton, { appearance: "outline", status: "primary", size: "small", onClick: () => onViewAll(employee), children: t('BUTTONS.VIEW_ALL') }) })) : null] })] }), _jsx("div", { children: _jsx(ScreenshotCarousel, { ref: carouselRef, children: (employee.timeSlots || []).map((timeSlot) => (_jsx("div", { className: "gz-rtt-carousel-slide", children: _jsx(ScreenshotItem, { timeSlot: timeSlot, timeZone: timeZone, timeFormat: timeFormat, employeeId: timeSlot.employee?.id ?? timeSlot.employeeId, organization: organization, dateFormatOptions: dateFormatOptions, onDelete: onDelete }) }, timeSlot.id))) }) })] }) }));
}
/**
 * The Recent Activities window (`gaWindowTemplate` #0): one row per employee with time slots,
 * or the per-period "No screenshot" message.
 */
export function RecentActivitiesWindow(props) {
    const { t } = useTranslation();
    const { timeSlotEmployees, loading, emptyMessage, ...rowProps } = props;
    const rows = (timeSlotEmployees || []).filter((employee) => (employee.timeSlots?.length ?? 0) > 0);
    return (_jsx(WindowCard, { title: t('TIMESHEET.RECENT_ACTIVITIES'), loading: loading, hasData: rows.length > 0, emptyMessage: emptyMessage, bodyClassName: "gz-rtt-custom-card-body-inner", emptyInBody: true, children: rows.map((employee) => (_jsx(EmployeeActivityRow, { employee: employee, ...rowProps }, employee.id))) }));
}
//# sourceMappingURL=RecentActivitiesWindow.js.map