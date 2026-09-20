import * as i0 from "@angular/core";
/**
 * Presentational body shared by the six Time Tracking counter widgets.
 *
 * It renders the inside of the legacy dashboard counter (large value plus the
 * `gauzy-counter-point` strip) and adds the two states a canvas-hosted widget
 * needs but the legacy page never had: a loading skeleton and a recoverable
 * error state.
 *
 * It deliberately renders NO card and NO title: on a canvas every widget is
 * already wrapped by `<ga-dashboard-widget-host>`, which owns the `nb-card`, the
 * header title and the edit-mode menu. Rendering our own would nest a card in a
 * card and print the title twice.
 *
 * Purely presentational on purpose — all fetching lives in
 * `BaseTimeTrackCounterWidgetComponent`, so this component stays trivially
 * reusable by any future counter.
 */
export declare class TimeTrackCounterCardComponent {
    /**
     * Optional translation key for a muted line under the counter.
     *
     * Used by the range-aware counters to say what the number actually covers
     * ("Worked over the period") when the selected range is not the one the host
     * header implies. `null` — the default — renders nothing, because repeating
     * the host's title inside the card is pure noise.
     */
    readonly captionKey: import("@angular/core").InputSignal<string>;
    /** Already formatted value shown as the headline figure (`"12"`, `"08:15:00"`, `"64%"`). */
    readonly value: import("@angular/core").InputSignal<string>;
    /** Raw numeric value driving the counter-point strip. */
    readonly counterValue: import("@angular/core").InputSignal<number>;
    /** Denominator for the counter-point strip. `0` falls back to a full day. */
    readonly total: import("@angular/core").InputSignal<number>;
    /**
     * Nebular status name used to colour filled points (`info`, `success`, …).
     *
     * A status — not a hex — because `CounterPointComponent` interpolates this
     * into `var(--color-<value>-default)`, which is what keeps the strip correct
     * in every theme.
     */
    readonly color: import("@angular/core").InputSignal<string>;
    /** Renders a progress bar instead of the point strip (percentage counters). */
    readonly progress: import("@angular/core").InputSignal<boolean>;
    /** Shows the skeleton instead of the value. */
    readonly loading: import("@angular/core").InputSignal<boolean>;
    /** Non-null switches the card into its error state. */
    readonly error: import("@angular/core").InputSignal<string>;
    /** Emitted when the user asks for a re-fetch from the error state. */
    readonly retry: import("@angular/core").OutputEmitterRef<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackCounterCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeTrackCounterCardComponent, "gz-time-track-counter-card", never, { "captionKey": { "alias": "captionKey"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "counterValue": { "alias": "counterValue"; "required": false; "isSignal": true; }; "total": { "alias": "total"; "required": false; "isSignal": true; }; "color": { "alias": "color"; "required": false; "isSignal": true; }; "progress": { "alias": "progress"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; }, { "retry": "retry"; }, never, never, true, never>;
}
