/**
 * Theme tokens standing in for the hard-coded hexes of the legacy Human
 * Resources page (`#089c17`, `#dbc300`, `#66de0b`, `#ff7b00`).
 *
 * `ga-info-block` applies these through `[style.color]`, so they have to be
 * CSS values rather than SCSS functions — Nebular publishes every palette entry
 * as a custom property, which is what keeps the blocks readable in all eight
 * themes instead of only the light one the hexes were picked for.
 */
export const HR_BLOCK_COLORS = {
    /** Money coming in. */
    INCOME: 'var(--color-success-default)',
    /** Money going out. */
    EXPENSE: 'var(--color-warning-default)',
    /** Bonus figures. */
    BONUS: 'var(--color-success-default)',
    /** Any figure that turned negative (loss, clawed-back bonus). */
    NEGATIVE: 'var(--color-danger-default)'
};
/** All-zero totals, shared so the identity stays stable across change detection. */
export const EMPTY_HR_TOTALS = Object.freeze({
    income: 0,
    nonBonusIncome: 0,
    expense: 0,
    expenseWithoutSalary: 0,
    salary: 0,
    profit: 0,
    bonus: 0,
    directIncomeBonus: 0,
    calculatedBonus: 0
});
/**
 * Rounds to the 2 decimals the legacy page rounds to.
 *
 * @param value - The raw sum.
 * @returns The value rounded to cents.
 */
function round(value) {
    return Number(value.toFixed(2));
}
/**
 * Sums one numeric column of the monthly statistics rows.
 *
 * Coerces every cell with `Number(...) || 0` instead of the legacy page's bare
 * `a + b[key]`: a single missing or `null` cell there poisons the whole sum into
 * `NaN`, which renders as an empty widget with no error to explain it.
 *
 * @param rows - Monthly statistics rows.
 * @param key - Column to add up.
 * @returns The rounded sum.
 */
function sumField(rows, key) {
    const total = rows.reduce((sum, row) => sum + (Number(row?.[key]) || 0), 0);
    return round(total);
}
/**
 * Reduces the monthly statistics rows to the aggregates the widgets render.
 *
 * Mirrors `HumanResourcesComponent.getEmployeeStatistics()` one for one.
 *
 * @param rows - Monthly statistics rows, or `null` before the first fetch.
 * @returns The derived totals; all zeros when there is nothing to sum.
 */
export function sumHrStatistics(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return EMPTY_HR_TOTALS;
    }
    const income = sumField(rows, 'income');
    const expense = sumField(rows, 'expense');
    const expenseWithoutSalary = sumField(rows, 'expenseWithoutSalary');
    const directIncomeBonus = sumField(rows, 'directIncomeBonus');
    const bonus = sumField(rows, 'bonus');
    return {
        income,
        nonBonusIncome: round(income - directIncomeBonus),
        expense,
        expenseWithoutSalary,
        salary: round(expense - expenseWithoutSalary),
        profit: sumField(rows, 'profit'),
        bonus,
        directIncomeBonus,
        calculatedBonus: round(bonus - directIncomeBonus)
    };
}
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
export function resolveHrEmployeeId(context) {
    if (!context) {
        return null;
    }
    const scoped = (context.employeeIds ?? []).find((id) => !!id);
    return scoped ?? context.selectedEmployee?.id ?? null;
}
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
export function hrStatisticsKey(context) {
    if (!context) {
        return '';
    }
    return [
        context.tenantId,
        context.organizationId,
        resolveHrEmployeeId(context),
        toEpoch(context.startDate),
        toEpoch(context.endDate)
    ].join('|');
}
/**
 * Epoch milliseconds of a value the context types as a `Date`.
 *
 * Defensive on purpose: a context restored from a bookmark carries an ISO
 * STRING, and calling `.getTime()` on it throws — inside the
 * `distinctUntilChanged` comparator that uses this key, the throw kills the
 * widget's subscription and the block stops reacting to the date picker for
 * the rest of the session. Mirrors the same guard in the chart widgets.
 *
 * @param value - The date to normalize.
 * @returns The epoch value, or an empty string when it is absent or unparsable.
 */
function toEpoch(value) {
    if (!value) {
        return '';
    }
    const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isNaN(time) ? '' : String(time);
}
//# sourceMappingURL=hr-statistics.utils.js.map