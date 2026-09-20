import type { IDashboardWidgetContext } from '@gauzy/ui-core/core';
/**
 * Granularity of the selected reporting window.
 *
 * Mirrors the `RangePeriod` enum declared on the legacy `TimeTrackingComponent`.
 * It is re-declared here on purpose: importing it from the component file would
 * drag the whole (eagerly-styled, Swiper-registering) dashboard component into
 * every lazily loaded widget chunk.
 */
export declare enum RangePeriod {
    DAY = "DAY",
    WEEK = "WEEK",
    PERIOD = "PERIOD"
}
/**
 * Classifies the selected date range as a single day, a week, or an arbitrary period.
 *
 * @param context The ambient dashboard widget context.
 * @returns The matching {@link RangePeriod}; defaults to `WEEK` when unknown.
 */
export declare function resolveRangePeriod(context: IDashboardWidgetContext | null): RangePeriod;
/**
 * Whether the selected range is exactly the current calendar week.
 *
 * Drives the "Worked this week" vs "Worked for the week" title, matching the
 * legacy dashboard wording.
 *
 * @param context The ambient dashboard widget context.
 * @returns True when the range spans the current week.
 */
export declare function isCurrentWeekRange(context: IDashboardWidgetContext | null): boolean;
/**
 * Whether the selected range spans more than one calendar week.
 *
 * Replicates `TimeTrackingComponent.isMoreThanWeek()`: the Members panel only
 * draws its per-day bar graph for ranges up to a week, because beyond that the
 * seven bars stop mapping onto seven real days.
 *
 * @param context The ambient dashboard widget context.
 * @returns True when the range is longer than a week.
 */
export declare function isMoreThanWeekRange(context: IDashboardWidgetContext | null): boolean;
/**
 * Total number of workable seconds in the selected range across all members.
 *
 * Used as the denominator ("total") of the duration counters so the coloured
 * points represent progress against capacity rather than against a fixed day.
 * Replicates `TimeTrackingComponent.period`.
 *
 * @param context The ambient dashboard widget context.
 * @param employeesCount Number of members that logged time in the range.
 * @returns The capacity in seconds; `0` when it cannot be derived.
 */
export declare function resolvePeriodSeconds(context: IDashboardWidgetContext | null, employeesCount: number): number;
/**
 * Stable fingerprint of everything a `/timesheet/statistics/*` request depends on.
 *
 * Used as the `distinctUntilChanged` comparator of the list widgets, so a
 * context change that CANNOT affect the response — a new `organization` object
 * identity after an unrelated store write, a currency or time-format switch —
 * does not re-run the fetch. The fields are exactly the ones
 * `buildStatisticsRequest` (@gauzy/ui-core/core) puts on the wire, so the
 * comparator can never be narrower than the payload it guards.
 *
 * @param context The ambient dashboard widget context.
 * @returns A deterministic key; the empty string for a missing context.
 */
export declare function timeTrackScopeKey(context: IDashboardWidgetContext | null): string;
/**
 * Builds the range-aware translation key the legacy panels used for their
 * "nothing here" message (`..._DAY` / `..._WEEK` / `..._PERIOD`).
 *
 * The suffixes ARE the {@link RangePeriod} values, so a widget only has to
 * declare the shared prefix.
 *
 * @param baseKey Translation key without the range suffix, e.g. `TIMESHEET.NO_MANUAL_TIME`.
 * @param period The classified range.
 * @returns The full translation key.
 */
export declare function rangeMessageKey(baseKey: string, period: RangePeriod): string;
/** One bar of the Members panel's weekly activity graph. */
export interface IWeekHourBar {
    /** Day index, 0 (Sunday) through 6. */
    day: number;
    /** Share of the member's week logged on that day, 0..100. */
    duration: number;
}
/**
 * Normalizes a member's `weekHours` into exactly seven bars of RELATIVE height.
 *
 * Replicates the underscore-based reshaping in `TimeTrackingComponent.getMembers()`
 * without pulling underscore into a lazily loaded widget chunk: the API returns
 * only the days that have logs, and each bar's height is that day's share of the
 * member's own week (so the tallest day of every member reaches the top).
 *
 * @param weekHours Raw per-day durations as returned by the API.
 * @returns Seven bars, ordered Sunday..Saturday, with `duration` as a percentage.
 */
export declare function toWeekHourBars(weekHours: Array<{
    duration: number;
    day: number;
}> | undefined): IWeekHourBar[];
/**
 * Normalizes anything thrown by an HTTP call (or held in the base widget's
 * `error` signal) into a displayable message.
 *
 * An `HttpErrorResponse` nests the server's text under `error.message`, so that
 * is unwrapped too. A bare object is NEVER stringified: `String({})` renders the
 * useless `[object Object]` straight into the widget's error state.
 *
 * @param error The caught value.
 * @returns A human readable message, or `null` when there is no error.
 */
export declare function toErrorMessage(error: unknown): string | null;
