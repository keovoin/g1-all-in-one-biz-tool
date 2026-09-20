import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * One row inside the accordion body of a Human Resources block.
 *
 * Titles and meta lines are carried as translation KEYS (plus their interpolation
 * parameters) rather than translated strings so the card can render them through
 * the `translate` pipe — which is what keeps the labels correct after a language
 * switch without every widget having to re-run its own translation.
 */
export interface IHrInfoBlockRow {
    /** Stable identity for `@for` tracking. */
    id: string;
    /** Translation key of the row title. */
    titleKey: string;
    /** Translation key of the muted line under the title, if any. */
    metaKey?: string | null;
    /** Interpolation parameters for {@link metaKey}. */
    metaParams?: Record<string, unknown> | null;
    /** Already formatted amount. */
    value: string;
    /** CSS colour applied to the amount (a Nebular custom property). */
    color: string;
    /** History dialog opened when the row is clicked; `null` makes it inert. */
    historyType?: EmployeeStatisticsHistoryEnum | null;
}
/**
 * Presentational shell shared by the nine Human Resources info-block widgets.
 *
 * It wraps — and never re-implements — the existing `ga-info-block`, adding the
 * three states a canvas-hosted widget needs but the legacy Human Resources page
 * never had:
 *
 * - a **loading skeleton**, so the card never flashes a hard `0` that reads as
 *   real data while the request is still in flight;
 * - a recoverable **error state** with a retry button;
 * - an actionable **empty state**, because every figure on this dashboard is
 *   about ONE employee and there is nothing meaningful to show — least of all
 *   zeros — until one is selected.
 *
 * It deliberately renders NO card chrome and NO card header: on a canvas every
 * widget is already wrapped by `<ga-dashboard-widget-host>`, which owns the
 * `nb-card`, the header title and the edit-mode menu. The title passed as
 * {@link titleKey} is the *block's* own label — the left column of
 * `ga-info-block`'s title/value row and the accordion header — not a second card
 * header, which is why it stays the short legacy wording ("Total Income") rather
 * than repeating the host's palette title ("Employee Total Income").
 *
 * Purely presentational on purpose — all fetching lives in
 * `BaseHrInfoWidgetComponent`.
 */
export declare class HrInfoCardComponent {
    /** Translation key of the block title. */
    readonly titleKey: import("@angular/core").InputSignal<string>;
    /** Translation key of the muted explanation under the title. */
    readonly metaKey: import("@angular/core").InputSignal<string>;
    /** Interpolation parameters for {@link metaKey}. */
    readonly metaParams: import("@angular/core").InputSignal<Record<string, unknown>>;
    /** Already formatted amount shown as the block's figure. */
    readonly value: import("@angular/core").InputSignal<string>;
    /**
     * CSS colour applied to the amount.
     *
     * A custom property (`var(--color-success-default)`) rather than a hex, so the
     * figure stays legible in every theme — see {@link HR_BLOCK_COLORS}.
     */
    readonly color: import("@angular/core").InputSignal<string>;
    /** Renders the emphasized variant the legacy page uses for Profit. */
    readonly highlight: import("@angular/core").InputSignal<boolean>;
    /** Rows shown in the accordion body; a non-empty list turns on the accordion. */
    readonly rows: import("@angular/core").InputSignal<IHrInfoBlockRow[]>;
    /** Shows the skeleton instead of the block. */
    readonly loading: import("@angular/core").InputSignal<boolean>;
    /** Non-null switches the card into its error state. */
    readonly error: import("@angular/core").InputSignal<string>;
    /** False renders the "select an employee" empty state. */
    readonly hasEmployee: import("@angular/core").InputSignal<boolean>;
    /**
     * Translation key of an explanation for why this figure cannot be shown for
     * the current organization (e.g. a bonus block whose bonus rule is not the
     * one the organization uses). `null` renders the figure normally.
     */
    readonly unavailableKey: import("@angular/core").InputSignal<string>;
    /** The user clicked the block itself. */
    readonly openInfo: import("@angular/core").OutputEmitterRef<void>;
    /** The user clicked one of the accordion rows. */
    readonly openRow: import("@angular/core").OutputEmitterRef<IHrInfoBlockRow>;
    /** The user asked for a re-fetch from the error state. */
    readonly retry: import("@angular/core").OutputEmitterRef<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrInfoCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrInfoCardComponent, "ga-hr-info-card", never, { "titleKey": { "alias": "titleKey"; "required": false; "isSignal": true; }; "metaKey": { "alias": "metaKey"; "required": false; "isSignal": true; }; "metaParams": { "alias": "metaParams"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "color": { "alias": "color"; "required": false; "isSignal": true; }; "highlight": { "alias": "highlight"; "required": false; "isSignal": true; }; "rows": { "alias": "rows"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "hasEmployee": { "alias": "hasEmployee"; "required": false; "isSignal": true; }; "unavailableKey": { "alias": "unavailableKey"; "required": false; "isSignal": true; }; }, { "openInfo": "openInfo"; "openRow": "openRow"; "retry": "retry"; }, never, never, true, never>;
}
