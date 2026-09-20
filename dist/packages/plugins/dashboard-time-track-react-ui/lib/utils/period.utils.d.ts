import moment from 'moment-timezone';
import { IDateRangePicker, IOrganization } from '@gauzy/contracts';
/**
 * Coarse shape of the selected date range — a mirror of the Angular `RangePeriod` enum in
 * `dashboard-time-track-angular-ui/.../time-tracking.component.ts` (same string values, so the
 * two flavours can share persisted state and i18n suffixes).
 */
export declare enum RangePeriod {
    DAY = "DAY",
    WEEK = "WEEK",
    PERIOD = "PERIOD"
}
/** Identity of the six counter widgets (array index in the default order = `position`). */
export declare enum Widgets {
    MEMBERS_WORKED = 0,
    PROJECTS_WORKED = 1,
    TODAY_ACTIVITY = 2,
    WORKED_TODAY = 3,
    WORKED_THIS_WEEK = 4,
    WEEKLY_ACTIVITY = 5
}
/** Identity of the six windows — same enum as the Angular `Windows`. */
export declare enum Windows {
    RECENT_ACTIVITIES = 0,
    MANUAL_TIMES = 1,
    TASKS = 2,
    PROJECTS = 3,
    APPS_URLS = 4,
    MEMBERS = 5
}
/** Number of counter widgets / windows the dashboard has. */
export declare const WIDGET_COUNT = 6;
export declare const WINDOW_COUNT = 6;
/** A start/end pair; both Angular `IDateRangePicker` and the API payload shapes satisfy it. */
export type DateRangeLike = Pick<IDateRangePicker, 'startDate' | 'endDate'> & {
    isCustomDate?: boolean;
};
/**
 * Detects the range period EXACTLY like Angular's `selectedPeriod` getter: a span of exactly
 * six days is a WEEK, zero days is a DAY, anything else (including 1–5 days) is a PERIOD.
 *
 * @param range Selected range; `undefined` yields `undefined` (Angular returns nothing before a
 * range exists).
 */
export declare function resolveRangePeriod(range?: DateRangeLike | null): RangePeriod | undefined;
/**
 * True when the range is exactly the current calendar week (moment locale week boundaries),
 * compared on the `YYYY-MM-DD` day like Angular's `isCurrentWeek()`.
 *
 * @param range Selected range.
 * @param now Injectable "now" for tests.
 */
export declare function isCurrentWeek(range?: DateRangeLike | null, now?: moment.Moment): boolean;
/** Angular `isMoreThanDays()`: the range spans more than one day. */
export declare function isMoreThanDays(range?: DateRangeLike | null): boolean;
/** Angular `isMoreThanWeek()`: the range spans more than one week. */
export declare function isMoreThanWeek(range?: DateRangeLike | null): boolean;
/**
 * The i18n key of the title prefix ("Daily" / "Weekly" / "Monthly"), mirroring Angular's
 * `headerTitle` getter: no range → WEEKLY; a custom range → no prefix (`null`); otherwise by
 * span.
 *
 * @param range Selected range.
 */
export declare function headerTitleKey(range?: DateRangeLike | null): string | null;
/**
 * The capacity (in seconds) the "Worked today/this week" dot strips are measured against —
 * Angular's `period` getter: days in range × the organization's working day (or 24h when the
 * org has no start/end time) × the number of employees who worked.
 *
 * @param range Selected range.
 * @param organization Organization carrying `defaultStartTime` / `defaultEndTime` (`HH:mm`).
 * @param employeesCount `counts.employeesCount`; `undefined` (counts not loaded) → `undefined`.
 */
export declare function periodCapacity(range: DateRangeLike | null | undefined, organization: Pick<IOrganization, 'defaultStartTime' | 'defaultEndTime'> | null | undefined, employeesCount: number | undefined): number | undefined;
/** Window titles by position (Angular `titleMapper(position, false)`). */
export declare const WINDOW_TITLE_KEYS: readonly string[];
/**
 * Widget titles by position for a given period (Angular `titleMapper(position, true)`).
 *
 * Positions 4 and 5 are period-aware: "Worked over the period" / "Activity over the period" for
 * a PERIOD, "…for the day" for a DAY, and "Worked this week" (current week) or "Worked for the
 * week" + "Weekly Activity" otherwise. Angular's array literally repeats MEMBERS_WORKED at 4/5
 * before the switch overwrites them; the switch always overwrites, so the defaults are the WEEK
 * keys here.
 *
 * @param period Detected period (undefined → WEEK branch, like Angular's `default`).
 * @param currentWeek Whether the range is the current week.
 */
export declare function widgetTitleKeys(period: RangePeriod | undefined, currentWeek: boolean): string[];
/**
 * Angular `titleMapper(position, isWidget)`.
 *
 * @param position Widget/window position (0–5).
 * @param isWidget Widget titles when true, window titles otherwise.
 * @param period Detected period.
 * @param currentWeek Whether the range is the current week.
 */
export declare function titleMapper(position: number, isWidget: boolean, period: RangePeriod | undefined, currentWeek: boolean): string;
/**
 * Builds the period-suffixed empty-state key, e.g. `emptyMessageKey('TIMESHEET.NO_SCREENSHOT', WEEK)`
 * → `TIMESHEET.NO_SCREENSHOT_WEEK`. Angular renders nothing when the period is unknown; this
 * falls back to the WEEK message so a stale-range render still says something.
 *
 * @param baseKey Key prefix without the period suffix.
 * @param period Detected period.
 */
export declare function emptyMessageKey(baseKey: string, period: RangePeriod | undefined): string;
