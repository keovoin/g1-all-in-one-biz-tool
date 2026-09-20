import { type CSSProperties } from 'react';
import { type NbStatus } from '../themeTokens';
/** Nebular spinner sizes; each maps to a `--spinner-height-<size>` token. */
export type SpinnerSize = 'tiny' | 'small' | 'medium' | 'large' | 'giant';
export interface SpinnerProps {
    /** Show the overlay. When false nothing renders. */
    active: boolean;
    status?: NbStatus;
    size?: SpinnerSize;
    /** Optional message next to the circle. */
    message?: string;
    className?: string;
    style?: CSSProperties;
}
/**
 * Spinner — port of the `[nbSpinner]` overlay: an absolutely positioned veil that covers its
 * (relatively positioned) parent, tinted with `--spinner-<status>-background-color`, with the
 * rotating two-tone circle Nebular draws.
 *
 * The parent must be `position: relative` (the Angular directive sets that on the host too).
 */
export declare function Spinner({ active, status, size, message, className, style }: SpinnerProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=Spinner.d.ts.map