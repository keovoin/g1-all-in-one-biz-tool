import { type CSSProperties } from 'react';
export interface CounterPointProps {
    /** Capacity the dots represent (0 → 86400, like the Angular component). */
    total?: number;
    /** Current value; filled dots = `value / total`. */
    value?: number;
    /** Fill colour: a Nebular status name (`'success'`) or a literal CSS colour (`'#0088FE'`). */
    color?: string;
    /** Render a progress bar instead of dots (`value` is then a percentage). */
    progress?: boolean;
    className?: string;
    style?: CSSProperties;
}
/** One dot of the strip. */
interface Point {
    color: string;
}
/**
 * Computes the dot strip exactly like `gauzy-counter-point` (`packages/ui-core/shared/src/lib/counter-point`):
 * a zero capacity means one working day in seconds, anything above 24 is normalised to 24 dots,
 * and dots at or above the value are painted `basic`.
 *
 * @param total Capacity.
 * @param value Current value.
 * @param color Fill colour (status name or CSS colour); empty → status from the percentage.
 */
export declare function computeCounterPoints(total: number, value: number, color: string): Point[];
/**
 * Resolves the CSS background for one dot.
 *
 * Nebular status names become `var(--color-<status>-default)`; anything that already reads as a
 * CSS colour (`#0088FE`, `rgb(...)`) is used verbatim — the Angular template only handles the
 * status form, so its hex-coloured strips fall through to an invalid `var(--color-#0088FE-default)`;
 * this port paints the colour the caller asked for.
 *
 * @param color Point colour.
 */
export declare function counterPointBackground(color: string): string;
/**
 * CounterPoint — React port of `<gauzy-counter-point>`: a strip of up to 24 pill-shaped dots
 * (10px high, 3px apart) or, with `progress`, a 10px Nebular progress bar.
 */
export declare function CounterPoint({ total, value, color, progress, className, style }: CounterPointProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CounterPoint.d.ts.map