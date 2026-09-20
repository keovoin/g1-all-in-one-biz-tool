import { IUser } from '@gauzy/contracts';
import { RangePeriod, type StatisticsPayload, type TimeTrackingContext } from '../utils';
/** Everything the dashboard derives from the Angular selectors, in one immutable snapshot. */
export interface TimeTrackingSelection extends TimeTrackingContext {
    /** The request all statistics endpoints receive (Angular `payloads$`). */
    payload: StatisticsPayload;
    /** Stable key of `payload` — a change means "refetch" (Angular `distinctUntilChange()`). */
    payloadKey: string;
    /** DAY / WEEK / PERIOD, detected exactly like Angular. */
    selectedPeriod: RangePeriod | undefined;
    /** Whether the range is the current calendar week (drives the "Worked this week" title). */
    currentWeek: boolean;
    /** True when an employee is selected (hides "Members worked" + the Members window). */
    hasEmployee: boolean;
    /** True when a project is selected (hides "Projects worked"). */
    hasProject: boolean;
}
/**
 * Subscribes to the SAME six Angular streams the `TimeTrackingComponent` combines
 * (`selectedOrganization$`, `selectedDateRange$`, `selectedEmployee$`, `selectedProject$`,
 * `selectedTeam$`, `timeZone$`) with the same `distinctUntilChange()` + `debounceTime(500)`
 * and the same "wait for org, range and employee" gates, and turns each emission into a
 * {@link TimeTrackingSelection} carrying the ready-to-send payload.
 *
 * @returns The current selection, or `null` until the Angular selectors have all emitted.
 */
export declare function useTimeTrackingContext(): TimeTrackingSelection | null;
/**
 * The signed-in user (Angular `store.user$`), or `null`.
 */
export declare function useCurrentUser(): IUser | null;
