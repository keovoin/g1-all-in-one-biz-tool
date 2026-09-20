import * as i0 from "@angular/core";
/**
 * Loading / error / empty wrapper shared by the list-shaped Time Tracking widgets.
 *
 * The six counter widgets get those states from `gz-time-track-counter-card`;
 * the five "window" panels (Manual Time, Tasks, Projects, Apps & URLs, Members)
 * need the same three states around arbitrary projected content, which is what
 * this component provides.
 *
 * It renders NO card: on a canvas every widget is already wrapped by
 * `<ga-dashboard-widget-host>`, which owns the `nb-card`, the header title and
 * the edit-mode menu — rendering our own would nest a card in a card.
 *
 * NOTE: `ga-teams-widget-state` in `@gauzy/ui-core/shared` does the same job for
 * the Teams widgets, but it is deliberately NOT part of that package's public
 * API (the dashboard widgets barrel exports only the registration arrays, so
 * widget components never reach the root bundle). A plugin therefore cannot
 * import it, exactly as this plugin already owns its own counter card.
 */
export declare class TimeTrackWidgetStateComponent {
    /** Shows the skeleton rows instead of the projected content. */
    readonly loading: import("@angular/core").InputSignal<boolean>;
    /** Non-null switches the wrapper into its error state. */
    readonly error: import("@angular/core").InputSignal<string>;
    /** True when the (successfully loaded) content has nothing to show. */
    readonly empty: import("@angular/core").InputSignal<boolean>;
    /**
     * Translation key of the message rendered in the empty state.
     *
     * The panels pass a RANGE-AWARE key ("No manual time for the day" vs "…over
     * the period"), which is what the legacy dashboard did through a `@switch`.
     */
    readonly emptyMessageKey: import("@angular/core").InputSignal<string>;
    /** How many skeleton rows to render while loading. */
    readonly skeletonRows: import("@angular/core").InputSignal<number>;
    /** Emitted when the user asks for a re-fetch from the error state. */
    readonly retry: import("@angular/core").OutputEmitterRef<void>;
    /**
     * Range the template repeats the skeleton rows over.
     *
     * A `computed` rather than a getter: `@for` needs an iterable, and a getter
     * would allocate a fresh array on every change-detection pass — which also
     * makes the `track` identity churn.
     *
     * Non-finite input falls back to the default INSTEAD of being clamped, because
     * clamping cannot catch it: every comparison with `NaN` is false, so `NaN`
     * survives `Math.max`/`Math.min` unchanged and `Array.from({ length: NaN })`
     * yields an EMPTY array — a blank card where the loading state should be.
     */
    protected readonly skeletonRange: import("@angular/core").Signal<number[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackWidgetStateComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeTrackWidgetStateComponent, "gz-time-track-widget-state", never, { "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "empty": { "alias": "empty"; "required": false; "isSignal": true; }; "emptyMessageKey": { "alias": "emptyMessageKey"; "required": false; "isSignal": true; }; "skeletonRows": { "alias": "skeletonRows"; "required": false; "isSignal": true; }; }, { "retry": "retry"; }, never, ["*"], true, never>;
}
