import { ID, IMonthAggregatedEmployeeStatistics } from '@gauzy/contracts';
import type { IDashboardWidgetContext } from '@gauzy/ui-core/core';
/**
 * Theme tokens standing in for the hard-coded hexes of the legacy Human
 * Resources page (`#089c17`, `#dbc300`, `#66de0b`, `#ff7b00`).
 *
 * `ga-info-block` applies these through `[style.color]`, so they have to be
 * CSS values rather than SCSS functions — Nebular publishes every palette entry
 * as a custom property, which is what keeps the blocks readable in all eight
 * themes instead of only the light one the hexes were picked for.
 */
export declare const HR_BLOCK_COLORS: {
    /** Money coming in. */
    readonly INCOME: "var(--color-success-default)";
    /** Money going out. */
    readonly EXPENSE: "var(--color-warning-default)";
    /** Bonus figures. */
    readonly BONUS: "var(--color-success-default)";
    /** Any figure that turned negative (loss, clawed-back bonus). */
    readonly NEGATIVE: "var(--color-danger-default)";
};
/**
 * Every aggregate the Human Resources dashboard derives from one
 * `/employee-statistics/months` response.
 *
 * Field-for-field the same set `HumanResourcesComponent.getEmployeeStatistics()`
 * computes, so a widget and the legacy page can never disagree on a number.
 */
export interface IHrStatisticsTotals {
    /** All income, bonus income included. */
    income: number;
    /** Income excluding the direct income bonus. */
    nonBonusIncome: number;
    /** All expenses, salary included. */
    expense: number;
    /** Expenses excluding salary. */
    expenseWithoutSalary: number;
    /** Salary, i.e. the difference between the two expense figures. */
    salary: number;
    /** Income minus expenses. */
    profit: number;
    /** Total bonus, direct income bonus included. */
    bonus: number;
    /** Bonus that came straight from income. */
    directIncomeBonus: number;
    /** Bonus computed from the organization's bonus rule (total minus direct). */
    calculatedBonus: number;
}
/** All-zero totals, shared so the identity stays stable across change detection. */
export declare const EMPTY_HR_TOTALS: IHrStatisticsTotals;
/**
 * Reduces the monthly statistics rows to the aggregates the widgets render.
 *
 * Mirrors `HumanResourcesComponent.getEmployeeStatistics()` one for one.
 *
 * @param rows - Monthly statistics rows, or `null` before the first fetch.
 * @returns The derived totals; all zeros when there is nothing to sum.
 */
export declare function sumHrStatistics(rows: IMonthAggregatedEmployeeStatistics[] | null | undefined): IHrStatisticsTotals;
/**
 * Resolves the single employee the Human Resources figures are about.
 *
 * The placement's own scope wins over the page selector, which is what lets the
 * same widget be dropped twice on one canvas and pinned to two different people.
 * `employeeIds` may legitimately hold a `null` (the "All Employees" selection
 * carries a null id), so entries are filtered rather than indexed blindly.
 *
 * @param context - The ambient dashboard widget context.
 * @returns The employee id, or `null` when the widget has no employee in scope.
 */
export declare function resolveHrEmployeeId(context: IDashboardWidgetContext | null | undefined): ID | null;
/**
 * Fingerprint of everything the statistics request is built from.
 *
 * Used as the `distinctUntilChanged` comparator so that context changes the
 * request does NOT depend on (project/team scope, time format, a re-emitted
 * organization object) never trigger another fetch.
 *
 * @param context - The ambient dashboard widget context.
 * @returns A stable key.
 */
export declare function hrStatisticsKey(context: IDashboardWidgetContext | null | undefined): string;
