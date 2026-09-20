import type { IDashboardWidgetContext } from '@gauzy/ui-core/core';
/**
 * Working seconds in one day for the context's organization.
 *
 * Replicates `TeamComponent._period`, with one correction: `moment(undefined,
 * 'HH:mm')` yields the CURRENT time instead of an invalid date, so an
 * organization without configured hours would produce a near-zero capacity
 * rather than reaching the documented full-day fallback.
 *
 * @param context - The ambient dashboard widget context.
 * @returns Seconds of capacity per day; a full day when it cannot be derived.
 */
export declare function resolveWorkingSeconds(context: IDashboardWidgetContext | null): number;
/**
 * Stable fingerprint of everything the Teams snapshot actually depends on.
 *
 * Used both as the cache key of {@link TeamsDashboardStatisticsService} and as
 * the `distinctUntilChanged` comparator of the widgets, so a context change that
 * cannot affect the numbers (currency, time format, a new `organization` object
 * identity after an unrelated store write) does NOT trigger a refetch.
 *
 * @param context - The ambient dashboard widget context.
 * @returns A deterministic key.
 */
export declare function teamsScopeKey(context: IDashboardWidgetContext | null): string;
/**
 * De-duplicates a list of entities by their `id`.
 *
 * The Teams dashboard counts members and projects ACROSS teams, where the same
 * employee or project legitimately appears more than once.
 *
 * @param items - The entities to filter.
 * @returns A new array holding the first occurrence of every id.
 */
export declare function uniqueById<T extends {
    id?: unknown;
}>(items: T[]): T[];
/**
 * Percentage of `value` within `total`, clamped to a renderable 0..100 range.
 *
 * @param value - The achieved amount.
 * @param total - The capacity. `0` (or a missing value) yields `0`.
 * @returns A percentage between 0 and 100.
 */
export declare function toPercentage(value: number, total: number): number;
