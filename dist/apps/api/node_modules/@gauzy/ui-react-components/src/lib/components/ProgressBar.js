"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = ProgressBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const progress_status_1 = require("../helpers/progress-status");
/**
 * ProgressBar — theme-adaptive port of `<nb-progress-bar>`.
 *
 * Track and fill colours come from the Nebular `--progress-bar-<status>-*` custom properties,
 * so the bar matches the Angular one under every theme.
 */
function ProgressBar({ value, status, size = 'tiny', height, displayValue = false, ariaLabel, className, style }) {
    const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
    const st = status ?? (0, progress_status_1.progressStatus)(percent);
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, role: "progressbar", "aria-label": ariaLabel, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent, style: {
            position: 'relative',
            width: '100%',
            height: height ?? `var(--progress-bar-${size}-height)`,
            background: `var(--progress-bar-${st}-background-color)`,
            borderRadius: 'var(--progress-bar-border-radius)',
            overflow: 'hidden',
            ...style
        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    width: `${percent}%`,
                    height: '100%',
                    background: `var(--progress-bar-${st}-filled-background-color)`,
                    borderRadius: 'var(--progress-bar-border-radius)',
                    transition: `width var(--progress-bar-animation-duration, 400ms) ease-in-out`
                } }), displayValue ? (
            // The label spans the WHOLE track (not the fill), so it stays legible at 0 % and small
            // values instead of being clipped inside a sliver of fill.
            (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", style: {
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: percent >= 50 ? `var(--progress-bar-${st}-text-color)` : 'inherit',
                    fontSize: `var(--progress-bar-${size}-text-font-size)`,
                    lineHeight: `var(--progress-bar-${size}-text-line-height)`,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                }, children: `${Math.round(percent)}%` })) : null] }));
}
//# sourceMappingURL=ProgressBar.js.map