import * as i0 from "@angular/core";
/**
 * Presentational body shared by the four Teams counter widgets.
 *
 * It renders the inside of the legacy Teams dashboard counter (large value, an
 * optional "/total" suffix and the `gauzy-counter-point` strip) and adds the two
 * states a canvas-hosted widget needs but the legacy page never had: a loading
 * skeleton and a recoverable error state.
 *
 * It deliberately renders NO card and NO title: on a canvas every widget is
 * already wrapped by `<ga-dashboard-widget-host>`, which owns the `nb-card`, the
 * header title and the edit-mode menu. Rendering our own would nest a card in a
 * card and print the title twice.
 *
 * Purely presentational on purpose — all fetching lives in
 * `BaseTeamsWidgetComponent`, so this component stays reusable by any future
 * Teams counter.
 */
export declare class TeamsCounterCardComponent {
    /** Already formatted headline figure (`"7"`, `"64"`). */
    readonly value: import("@angular/core").InputSignal<string>;
    /**
     * Muted text rendered right after the value (`"/12"`, `"%"`).
     *
     * Mirrors the legacy card, where the denominator is deliberately smaller than
     * the number it qualifies. `null` renders nothing.
     */
    readonly suffix: import("@angular/core").InputSignal<string>;
    /** Raw numeric value driving the counter-point strip. */
    readonly counterValue: import("@angular/core").InputSignal<number>;
    /** Denominator for the counter-point strip. `0` falls back to a full day. */
    readonly total: import("@angular/core").InputSignal<number>;
    /**
     * Nebular status name used to colour filled points (`info`, `success`, …).
     *
     * A status — not a hex — because `CounterPointComponent` interpolates this
     * into `var(--color-<value>-default)`, which is what keeps the strip correct
     * in every theme. The empty default reproduces the legacy card, where the
     * colour is derived from how full the strip is.
     */
    readonly color: import("@angular/core").InputSignal<string>;
    /** Renders a progress bar instead of the point strip (percentage counters). */
    readonly progress: import("@angular/core").InputSignal<boolean>;
    /** Optional translation key for a muted line under the counter. */
    readonly captionKey: import("@angular/core").InputSignal<string>;
    /** Shows the skeleton instead of the value. */
    readonly loading: import("@angular/core").InputSignal<boolean>;
    /** Non-null switches the card into its error state. */
    readonly error: import("@angular/core").InputSignal<string>;
    /** Emitted when the user asks for a re-fetch from the error state. */
    readonly retry: import("@angular/core").OutputEmitterRef<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamsCounterCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamsCounterCardComponent, "ga-teams-counter-card", never, { "value": { "alias": "value"; "required": false; "isSignal": true; }; "suffix": { "alias": "suffix"; "required": false; "isSignal": true; }; "counterValue": { "alias": "counterValue"; "required": false; "isSignal": true; }; "total": { "alias": "total"; "required": false; "isSignal": true; }; "color": { "alias": "color"; "required": false; "isSignal": true; }; "progress": { "alias": "progress"; "required": false; "isSignal": true; }; "captionKey": { "alias": "captionKey"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; }, { "retry": "retry"; }, never, never, true, never>;
}
