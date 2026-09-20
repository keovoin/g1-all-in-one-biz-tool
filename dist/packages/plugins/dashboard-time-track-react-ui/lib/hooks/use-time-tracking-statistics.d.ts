import { IActivitiesStatistics, ICountsStatistics, IManualTimesStatistics, IMembersStatistics, IProjectsStatistics, ITasksStatistics, ITimeSlotStatistics } from '@gauzy/contracts';
import { Windows } from '../utils';
import { type TimeTrackingSelection } from './use-time-tracking-context';
/** Angular `setAutoRefresh`: `timer(0, 60000 * 5)` — five minutes. */
export declare const AUTO_REFRESH_INTERVAL_MS: number;
/** Per-panel loading flags (Angular `*Loading` booleans). */
export interface StatisticsLoading {
    counts: boolean;
    timeSlots: boolean;
    activities: boolean;
    projects: boolean;
    tasks: boolean;
    manualTimes: boolean;
    members: boolean;
}
export interface UseTimeTrackingStatisticsOptions {
    /** Current selection (payload etc.); `null` until the Angular selectors emitted. */
    selection: TimeTrackingSelection | null;
    /** Auto-refresh toggle (5-minute timer while on). */
    autoRefresh: boolean;
    /** Read at fetch time: skip `getCounts` when every widget is hidden. */
    isAllWidgetsHidden: () => boolean;
    /** Read at fetch time: skip a window's fetch while it is hidden. */
    isWindowHidden: (position: Windows) => boolean;
    /** `CHANGE_SELECTED_EMPLOYEE` — the Members window/fetch is gated on it. */
    canViewMembers: boolean;
    /** True when the signed-in user IS an employee (Angular skips `loadEmployeesCount` then). */
    isEmployeeUser: boolean;
}
export interface TimeTrackingStatistics {
    counts: ICountsStatistics | null;
    timeSlots: ITimeSlotStatistics[];
    activities: IActivitiesStatistics[];
    projects: IProjectsStatistics[];
    tasks: ITasksStatistics[];
    manualTimes: IManualTimesStatistics[];
    members: IMembersStatistics[];
    loading: StatisticsLoading;
    /** `EmployeesService.getCount` — the "Members worked" dot-strip denominator. */
    employeesCount: number | undefined;
    /** `OrganizationProjectsService.getCount` — the "Projects worked" dot-strip denominator. */
    projectsCount: number | undefined;
    /** Manual refresh (Angular `logs$.next(true)`): clears the gallery and refetches everything. */
    refresh: () => Promise<void>;
    /** Refetches the counters only (a widget was re-shown). */
    fetchCounts: () => Promise<void>;
    /** Refetches one window's data (Angular `recover(position)`). */
    recoverWindow: (position: Windows) => Promise<void>;
}
/**
 * The data layer of the React Time Tracking dashboard — a hook-shaped port of the fetch half of
 * Angular's `TimeTrackingComponent`.
 *
 * Same services (`TimesheetStatisticsService` promise API), same seven requests, same
 * skip-when-hidden gates, `Promise.allSettled`, `ToastrService.error` on failure, the same
 * `durationPercentage` / `weekHours` reshaping, `GalleryService.clearGallery()` on every refresh
 * and on unmount, and the same auto-refresh (5 minutes, restarted whenever the selection
 * changes). Results from a superseded selection are dropped so a slow response cannot
 * overwrite a newer one.
 *
 * @param options See {@link UseTimeTrackingStatisticsOptions}.
 */
export declare function useTimeTrackingStatistics(options: UseTimeTrackingStatisticsOptions): TimeTrackingStatistics;
