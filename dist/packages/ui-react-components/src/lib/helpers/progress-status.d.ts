import type { NbStatus } from '../themeTokens';
/**
 * Maps a percentage to the Nebular status Gauzy paints it with.
 *
 * A byte-for-byte mirror of `progressStatus()` in `@gauzy/ui-core/common` (kept local so this
 * package stays free of Angular/@gauzy dependencies): 0–25 danger, 26–50 warning, 51–75 info,
 * above success.
 *
 * @param value Percentage (0–100).
 */
export declare function progressStatus(value: number): Extract<NbStatus, 'danger' | 'warning' | 'info' | 'success'>;
//# sourceMappingURL=progress-status.d.ts.map