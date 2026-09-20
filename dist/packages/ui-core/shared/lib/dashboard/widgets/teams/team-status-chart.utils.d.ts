/**
 * Colours the team status doughnut needs, resolved from the ACTIVE theme.
 *
 * A `<canvas>` cannot resolve a CSS custom property, so the value has to be
 * looked up in TypeScript — this is the canvas equivalent of `nb-theme()`. The
 * orphaned `gz-doughnut-chart` this widget replaces baked the literal colours
 * `green` / `orange` / `red` into its dataset, which reads wrong in every dark
 * theme and ignores the palette entirely.
 */
export interface ITeamStatusChartPalette {
    /** Members (or teams) with a running timer. */
    online: string;
    /** Worked today but currently idle. */
    working: string;
    /** Did not work in the range. */
    notWorking: string;
    /** Legend label colour. */
    textColor: string;
}
/** Shape of the slice of `NbJSThemeOptions.variables` this chart reads. */
type ThemeVariables = Record<string, unknown> | undefined | null;
/**
 * Resolves the team status palette for the currently active theme.
 *
 * @param variables - `NbJSThemeOptions.variables` of the active theme.
 * @param element - The widget's host element, used to read CSS custom properties
 *                  when the JS theme does not declare a variable.
 * @returns A fully populated palette; never throws and never returns an empty colour.
 */
export declare function resolveTeamStatusPalette(variables: ThemeVariables, element?: Element | null): ITeamStatusChartPalette;
export {};
