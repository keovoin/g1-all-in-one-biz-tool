import { type CSSProperties } from 'react';
import { type NbStatus } from '../themeTokens';
/** Nebular progress-bar sizes; each maps to a `--progress-bar-<size>-height` token. */
export type ProgressBarSize = 'tiny' | 'small' | 'medium' | 'large' | 'giant';
export interface ProgressBarProps {
    /** Percentage 0–100 (clamped). */
    value: number;
    /** Nebular status; defaults to `progressStatus(value)` like the Gauzy dashboards. */
    status?: NbStatus;
    /** Nebular size token; defaults to `tiny`. */
    size?: ProgressBarSize;
    /** Explicit track height (overrides the size token) — Gauzy dashboards use 5px / 10px. */
    height?: string;
    /** Renders the percentage text inside the bar (Nebular `displayValue`). */
    displayValue?: boolean;
    /** Accessible name — what this percentage measures ("Project share", "Weekly activity"). */
    ariaLabel?: string;
    className?: string;
    style?: CSSProperties;
}
/**
 * ProgressBar — theme-adaptive port of `<nb-progress-bar>`.
 *
 * Track and fill colours come from the Nebular `--progress-bar-<status>-*` custom properties,
 * so the bar matches the Angular one under every theme.
 */
export declare function ProgressBar({ value, status, size, height, displayValue, ariaLabel, className, style }: ProgressBarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProgressBar.d.ts.map