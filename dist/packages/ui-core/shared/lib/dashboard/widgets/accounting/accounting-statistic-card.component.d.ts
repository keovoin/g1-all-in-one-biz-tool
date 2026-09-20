import * as i0 from "@angular/core";
/**
 * Presentational body shared by the four Accounting KPI widgets.
 *
 * It renders the existing `<ga-single-statistic>` — the very component the
 * Accounting dashboard page uses — and adds the three states a canvas-hosted
 * widget needs but that page never had: a loading skeleton, a recoverable error
 * state, and an "unavailable" hint (the bonus KPI is meaningless for an
 * organization with no bonus type configured).
 *
 * It deliberately renders NO card and NO title: on a canvas every widget is
 * already wrapped by `<ga-dashboard-widget-host>`, which owns the `nb-card`, the
 * header title and the edit-mode menu. Rendering our own would nest a card in a
 * card and print the title twice — which is also why the statistic's own title
 * slot is collapsed in the stylesheet instead of being fed a duplicate label.
 *
 * Purely presentational on purpose — all fetching and currency formatting live
 * in `BaseAccountingWidgetComponent`, so this component stays trivially reusable
 * by any future money KPI.
 */
export declare class AccountingStatisticCardComponent {
    /**
     * Already formatted headline figure (`"$1,234.00"`, `"1 234,00 €"`).
     *
     * A string, not a number: currency formatting depends on the organization's
     * currency AND its currency position, both of which the widget resolves from
     * the dashboard context.
     */
    readonly value: import("@angular/core").InputSignal<string>;
    /**
     * Colour of the figure, as a CSS custom property reference
     * (`var(--color-info-default)`), so the KPI stays correct in every theme.
     *
     * Ignored when {@link type} is `highlight`, which the statistic component
     * renders in its own success colour.
     */
    readonly color: import("@angular/core").InputSignal<string>;
    /** `ga-single-statistic` display variant; `highlight` renders the success style. */
    readonly type: import("@angular/core").InputSignal<string>;
    /** Shows the skeleton instead of the value. */
    readonly loading: import("@angular/core").InputSignal<boolean>;
    /** Non-null switches the card into its error state. */
    readonly error: import("@angular/core").InputSignal<string>;
    /**
     * Translation key of a hint replacing the value when the KPI cannot apply to
     * the current organization. `null` — the default — renders the value.
     */
    readonly unavailableKey: import("@angular/core").InputSignal<string>;
    /** Emitted when the user asks for a re-fetch from the error state. */
    readonly retry: import("@angular/core").OutputEmitterRef<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccountingStatisticCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AccountingStatisticCardComponent, "ga-accounting-statistic-card", never, { "value": { "alias": "value"; "required": false; "isSignal": true; }; "color": { "alias": "color"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "unavailableKey": { "alias": "unavailableKey"; "required": false; "isSignal": true; }; }, { "retry": "retry"; }, never, never, true, never>;
}
