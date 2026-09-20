const COLOR_TOKENS = {
    online: { themeVariable: 'success', cssVariable: '--color-success-default', fallback: 'green' },
    working: { themeVariable: 'warning', cssVariable: '--color-warning-default', fallback: 'orange' },
    notWorking: { themeVariable: 'danger', cssVariable: '--color-danger-default', fallback: 'crimson' },
    textColor: { themeVariable: 'fgText', cssVariable: '--text-basic-color', fallback: 'gray' }
};
/**
 * Resolves the team status palette for the currently active theme.
 *
 * @param variables - `NbJSThemeOptions.variables` of the active theme.
 * @param element - The widget's host element, used to read CSS custom properties
 *                  when the JS theme does not declare a variable.
 * @returns A fully populated palette; never throws and never returns an empty colour.
 */
export function resolveTeamStatusPalette(variables, element) {
    // `chartjs` is the block every Gauzy theme declares for Chart.js specifically;
    // preferring its text colour keeps this widget consistent with the other charts.
    const chartJs = (variables?.['chartjs'] ?? {});
    return {
        online: resolveColor(COLOR_TOKENS.online, variables, element),
        working: resolveColor(COLOR_TOKENS.working, variables, element),
        notWorking: resolveColor(COLOR_TOKENS.notWorking, variables, element),
        textColor: chartJs.textColor || resolveColor(COLOR_TOKENS.textColor, variables, element)
    };
}
/**
 * Resolves one palette slot: JS theme variable, then CSS custom property, then
 * the documented fallback.
 *
 * @param token - The slot to resolve.
 * @param variables - The active theme's JS variables.
 * @param element - Host element for the CSS custom property lookup.
 * @returns A non-empty CSS colour string.
 */
function resolveColor(token, variables, element) {
    const themed = variables?.[token.themeVariable];
    if (typeof themed === 'string' && themed.trim()) {
        return themed.trim();
    }
    return readCssVariable(token.cssVariable, element) || token.fallback;
}
/**
 * Reads a CSS custom property off an element.
 *
 * Guarded for non-browser platforms (SSR, unit tests) where `getComputedStyle`
 * does not exist — a widget must degrade to its fallback colour, not crash.
 *
 * @param name - The custom property name, including the leading `--`.
 * @param element - Element to resolve against; falls back to the document root.
 * @returns The trimmed value, or an empty string when it cannot be read.
 */
function readCssVariable(name, element) {
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
        return '';
    }
    const target = element ?? (typeof document !== 'undefined' ? document.documentElement : null);
    if (!target) {
        return '';
    }
    try {
        return window.getComputedStyle(target).getPropertyValue(name).trim();
    }
    catch {
        return '';
    }
}
//# sourceMappingURL=team-status-chart.utils.js.map