import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PermissionsEnum } from '@gauzy/contracts';
import { EmployeesService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TimeZoneService } from '@gauzy/ui-core/shared';
import { useInjector, useObservable, useTranslation, useTypedEvent } from '@gauzy/ui-react';
import './nebular-jsx';
import { WidgetVisibilityChangedEvent } from '../dashboard-time-track-react-ui.events';
import { useDashboardLayout } from '../hooks/use-dashboard-layout';
import { usePermission } from '../hooks/use-permission';
import { useCurrentUser, useTimeTrackingContext } from '../hooks/use-time-tracking-context';
import { useTimeTrackingStatistics } from '../hooks/use-time-tracking-statistics';
import { durationFormat, reportDateParam } from '../utils/format.utils';
import { emptyMessageKey, isMoreThanWeek, periodCapacity, titleMapper, WIDGET_COUNT, Widgets, WINDOW_COUNT, WINDOW_TITLE_KEYS, Windows } from '../utils/period.utils';
import { ManageWidgetsPopover } from './header/ManageWidgetsPopover';
import { HeaderToolbar } from './header/HeaderToolbar';
import { TimezoneFilter } from './header/TimezoneFilter';
import { DraggableLayout } from './layout/DraggableLayout';
import { TIME_TRACKING_STYLES } from './styles';
import { CounterWidget } from './widgets/CounterWidget';
import { AppsUrlsWindow } from './windows/AppsUrlsWindow';
import { ManualTimeWindow } from './windows/ManualTimeWindow';
import { MembersWindow } from './windows/MembersWindow';
import { PercentageListWindow } from './windows/PercentageListWindow';
import { RecentActivitiesWindow } from './windows/RecentActivitiesWindow';
/**
 * DashboardTimeTrackReactUiPage — the React Time Tracking dashboard, feature-for-feature with
 * the Angular `TimeTrackingComponent`.
 *
 * Mounted once in the page card body by `DashboardTimeTrackReactUiPageComponent`; the header
 * controls are rendered into the card header through portals. Everything below the header —
 * the six counter widgets, the six windows, the ⋮ menus, drag & drop, the Manage-widgets popover
 * — is React; data, layout persistence, permissions, dialogs and navigation go through the
 * Angular services obtained from the injector, so both flavours share one data path and one
 * persisted layout.
 */
export function DashboardTimeTrackReactUiPage({ headerActionsHost, headerToolbarHost }) {
    const { t } = useTranslation();
    const injector = useInjector();
    const router = useMemo(() => injector.get(Router), [injector]);
    const store = useMemo(() => injector.get(Store), [injector]);
    const employeesService = useMemo(() => injector.get(EmployeesService, null), [injector]);
    const toastr = useMemo(() => injector.get(ToastrService, null), [injector]);
    const timeZoneService = useMemo(() => injector.get(TimeZoneService), [injector]);
    const visibilityEvent = useTypedEvent(WidgetVisibilityChangedEvent);
    // ── Angular state ────────────────────────────────────────────
    const selection = useTimeTrackingContext();
    const user = useCurrentUser();
    const canChangeSelectedEmployee = usePermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
    const timeFormat = useObservable(useMemo(() => timeZoneService.timeFormat$, [timeZoneService]), timeZoneService.currentTimeFormat);
    const timeZone = useObservable(useMemo(() => timeZoneService.timeZone$, [timeZoneService]), timeZoneService.currentTimeZone);
    const preferredLanguage = useObservable(useMemo(() => store.preferredLanguage$, [store]), store.preferredLanguage);
    const organization = selection?.organization ?? null;
    const period = selection?.selectedPeriod;
    const currentWeek = selection?.currentWeek ?? false;
    const dateFormatOptions = useMemo(() => ({ dateFormat: organization?.dateFormat, locale: preferredLanguage || organization?.regionCode }), [organization?.dateFormat, organization?.regionCode, preferredLanguage]);
    // ── Titles (period-aware, translated) ────────────────────────
    const widgetTitle = useCallback((position) => t(titleMapper(position, true, period, currentWeek)), [t, period, currentWeek]);
    const windowTitle = useCallback((position) => t(WINDOW_TITLE_KEYS[position]), [t]);
    // ── Persisted layouts (shared with the Angular tab) ──────────
    const widgets = useDashboardLayout('widgets', WIDGET_COUNT, { getTitle: widgetTitle });
    const windows = useDashboardLayout('windows', WINDOW_COUNT, { getTitle: windowTitle });
    // ── Auto refresh + statistics ────────────────────────────────
    const [autoRefresh, setAutoRefresh] = useState(true);
    const stats = useTimeTrackingStatistics({
        selection,
        autoRefresh,
        isAllWidgetsHidden: widgets.peekAllHidden,
        isWindowHidden: windows.peekHidden,
        canViewMembers: canChangeSelectedEmployee,
        isEmployeeUser: !!user?.employee
    });
    // Angular auto-hide rules: an employee selection hides "Members worked" + the Members window,
    // a project selection hides "Projects worked" (re-showing is not automatic — same as Angular,
    // where `hideEmployeeBlock` re-hides on every change-detection pass).
    const hasEmployee = selection?.hasEmployee ?? false;
    const hasProject = selection?.hasProject ?? false;
    useEffect(() => {
        if (hasEmployee) {
            widgets.hide(Widgets.MEMBERS_WORKED);
            windows.hide(Windows.MEMBERS);
        }
        if (hasProject)
            widgets.hide(Widgets.PROJECTS_WORKED);
    }, [hasEmployee, hasProject, widgets, windows]);
    // ── Manage-widgets callbacks (Angular updateWidgetVisibility / updateWindowVisibility) ──
    const onWidgetToggled = useCallback((item, hidden) => {
        visibilityEvent.emit({ widgetId: `widget:${item.position}`, visible: !hidden });
        if (!hidden)
            void stats.fetchCounts();
    }, [visibilityEvent, stats]);
    const onWindowToggled = useCallback((item, hidden) => {
        visibilityEvent.emit({ widgetId: `window:${item.position}`, visible: !hidden });
        if (!hidden)
            void stats.recoverWindow(item.position);
    }, [visibilityEvent, stats]);
    // ── Navigation (same routes + query params as Angular) ───────
    const openEmployee = useCallback((id) => void router.navigate([`/pages/employees/edit/${id}`]), [router]);
    const redirectToScreenshots = useCallback(async (employee) => {
        if (!employee?.id || !employeesService)
            return;
        try {
            const people = await firstValueFrom(employeesService.getEmployeeById(employee.id, ['user']));
            store.selectedEmployee = {
                id: people.id,
                firstName: people.user?.firstName,
                lastName: people.user?.lastName,
                imageUrl: people.user?.imageUrl,
                employeeLevel: people.employeeLevel,
                fullName: people.user?.name,
                shortDescription: people.short_description
            };
            void router.navigate(['/pages/employees/activity/screenshots']);
        }
        catch (error) {
            console.error('Error while redirecting to the screenshots page.', error);
            toastr?.error(error?.message || 'Could not open the screenshots page.');
        }
    }, [employeesService, store, router, toastr]);
    const redirectToTask = useCallback(() => void router.navigate(['pages/tasks/dashboard']), [router]);
    const redirectToReport = useCallback((path) => {
        const range = selection?.dateRange;
        if (!range)
            return;
        void router.navigate([path], {
            queryParams: { date: reportDateParam(range.startDate), date_end: reportDateParam(range.endDate) }
        });
    }, [router, selection?.dateRange]);
    const redirectToManualTimeReport = useCallback(() => redirectToReport('/pages/reports/manual-time-edits'), [redirectToReport]);
    const redirectToAppUrlReport = useCallback(() => redirectToReport('/pages/reports/apps-urls'), [redirectToReport]);
    // ── Derived figures ──────────────────────────────────────────
    const counts = stats.counts;
    const capacity = periodCapacity(selection?.dateRange, organization, counts?.employeesCount);
    const moreThanWeek = isMoreThanWeek(selection?.dateRange);
    const empty = useCallback((base) => t(emptyMessageKey(base, period)), [t, period]);
    // The Angular header shows the "View All" flow through the refresh subject; a deletion here refetches too.
    const refreshRef = useRef(stats.refresh);
    refreshRef.current = stats.refresh;
    const onSlotDeleted = useCallback(() => void refreshRef.current(), []);
    // ── Widgets ──────────────────────────────────────────────────
    const renderWidget = (item) => {
        const loading = stats.loading.counts;
        switch (item.position) {
            case Widgets.MEMBERS_WORKED:
                if (!canChangeSelectedEmployee)
                    return null;
                return (_jsx(CounterWidget, { title: widgetTitle(item.position), value: counts?.employeesCount || 0, loading: loading, total: stats.employeesCount, counterValue: counts?.employeesCount || 0, color: "#0088FE" }));
            case Widgets.PROJECTS_WORKED:
                return (_jsx(CounterWidget, { title: widgetTitle(item.position), value: counts?.projectsCount || 0, loading: loading, total: stats.projectsCount, counterValue: counts?.projectsCount || 0, color: "#00D68F" }));
            case Widgets.TODAY_ACTIVITY:
                return (_jsx(CounterWidget, { title: widgetTitle(item.position), value: `${counts?.todayActivities || 0}%`, loading: loading, counterValue: counts?.todayActivities || 0, progress: true }));
            case Widgets.WORKED_TODAY:
                return (_jsx(CounterWidget, { title: widgetTitle(item.position), value: durationFormat(counts?.todayDuration || 0), loading: loading, total: capacity, counterValue: counts?.todayDuration || 0, color: "#00D68F" }));
            case Widgets.WORKED_THIS_WEEK:
                return (_jsx(CounterWidget, { title: widgetTitle(item.position), value: durationFormat(counts?.weekDuration || 0), loading: loading, total: capacity, counterValue: counts?.weekDuration || 0, color: "#00D68E" }));
            case Widgets.WEEKLY_ACTIVITY:
                return (_jsx(CounterWidget, { title: widgetTitle(item.position), value: `${counts?.weekActivities || 0}%`, loading: loading, counterValue: counts?.weekActivities || 0, progress: true }));
            default:
                return null;
        }
    };
    // ── Windows ──────────────────────────────────────────────────
    const renderWindow = (item) => {
        switch (item.position) {
            case Windows.RECENT_ACTIVITIES:
                return (_jsx(RecentActivitiesWindow, { timeSlotEmployees: stats.timeSlots, loading: stats.loading.timeSlots, emptyMessage: empty('TIMESHEET.NO_SCREENSHOT'), timeZone: timeZone, timeFormat: timeFormat, organization: organization, dateFormatOptions: dateFormatOptions, canChangeSelectedEmployee: canChangeSelectedEmployee, onViewAll: (employee) => void redirectToScreenshots(employee), onOpenEmployee: openEmployee, onDelete: onSlotDeleted }));
            case Windows.MANUAL_TIMES:
                return (_jsx(ManualTimeWindow, { manualTimes: stats.manualTimes, loading: stats.loading.manualTimes, emptyMessage: empty('TIMESHEET.NO_MANUAL_TIME'), dateFormatOptions: dateFormatOptions, onViewReport: redirectToManualTimeReport, onOpenEmployee: openEmployee }));
            case Windows.TASKS:
                return (_jsx(PercentageListWindow, { title: t('TIMESHEET.TASKS'), rows: stats.tasks.map((task) => ({
                        id: task.id,
                        name: task.title,
                        durationPercentage: task.durationPercentage,
                        duration: task.duration
                    })), loading: stats.loading.tasks, emptyMessage: empty('TIMESHEET.NO_TASK_ACTIVITY'), action: { label: t('BUTTONS.VIEW_ALL'), onClick: redirectToTask } }));
            case Windows.PROJECTS:
                return (_jsx(PercentageListWindow, { title: t('TIMESHEET.PROJECTS'), rows: stats.projects.map((project) => ({
                        id: project.id,
                        name: project.name,
                        durationPercentage: project.durationPercentage,
                        duration: project.duration
                    })), loading: stats.loading.projects, emptyMessage: empty('TIMESHEET.NO_PROJECT_ACTIVITY') }));
            case Windows.APPS_URLS:
                return (_jsx(AppsUrlsWindow, { activities: stats.activities, loading: stats.loading.activities, emptyMessage: empty('TIMESHEET.NO_APP_URL_ACTIVITY'), onViewReport: redirectToAppUrlReport }));
            case Windows.MEMBERS:
                if (!canChangeSelectedEmployee)
                    return null;
                return (_jsx(MembersWindow, { members: stats.members, loading: stats.loading.members, emptyMessage: empty('TIMESHEET.NO_MEMBER_ACTIVITY'), selectedPeriod: period, moreThanWeek: moreThanWeek, onOpenEmployee: openEmployee }));
            default:
                return null;
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: TIME_TRACKING_STYLES }), headerActionsHost
                ? createPortal(_jsxs("div", { className: "gz-rtt-hdr", children: [_jsx(TimezoneFilter, {}), _jsx("div", { className: "gz-rtt-mr-2" }), _jsx(ManageWidgetsPopover, { widgets: widgets, windows: windows, widgetTitle: widgetTitle, windowTitle: windowTitle, onWidgetToggled: onWidgetToggled, onWindowToggled: onWindowToggled })] }), headerActionsHost)
                : null, headerToolbarHost
                ? createPortal(_jsx("div", { className: "gz-rtt-hdr", children: _jsx(HeaderToolbar, { autoRefresh: autoRefresh, onAutoRefreshChange: setAutoRefresh, onRefresh: () => void stats.refresh() }) }), headerToolbarHost)
                : null, _jsx("div", { className: "gz-rtt", children: _jsxs("div", { className: "gz-rtt-container", children: [_jsx(DraggableLayout, { kind: "widget", layout: widgets, renderItem: renderWidget }), _jsx(DraggableLayout, { kind: "window", layout: windows, renderItem: renderWindow })] }) })] }));
}
//# sourceMappingURL=DashboardTimeTrackReactUiPage.js.map