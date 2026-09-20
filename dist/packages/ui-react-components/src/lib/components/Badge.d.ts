import { type CSSProperties, type ReactNode } from 'react';
import { type NbStatus } from '../themeTokens';
export interface BadgeProps {
    /** Badge text (Nebular `[text]`). */
    text?: ReactNode;
    /** Nebular status; drives `--badge-<status>-*` colours. */
    status?: NbStatus;
    className?: string;
    style?: CSSProperties;
}
/**
 * Badge — theme-adaptive port of `<nb-badge>` in its "unpositioned" dashboard form
 * (`position: unset; display: table; margin: 10px auto 0` in the Time Tracking SCSS).
 */
export declare function Badge({ text, status, className, style }: BadgeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Badge.d.ts.map