import * as i0 from "@angular/core";
/**
 * Loading / error / empty wrapper shared by the list-shaped Teams widgets.
 *
 * The counter widgets get those three states from `ga-teams-counter-card`; the
 * team-card grid, the member list and the status chart need the same states
 * around arbitrary projected content, which is what this component provides.
 *
 * It renders no card: `ga-dashboard-widget-host` already owns the `nb-card`,
 * the header and the edit-mode menu.
 */
export declare class TeamsWidgetStateComponent {
    /** Shows the skeleton rows instead of the content. */
    readonly loading: import("@angular/core").InputSignal<boolean>;
    /** Non-null switches the wrapper into its error state. */
    readonly error: import("@angular/core").InputSignal<string>;
    /** True when the (successfully loaded) content has nothing to show. */
    readonly empty: import("@angular/core").InputSignal<boolean>;
    /** Translation key of the message rendered in the empty state. */
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
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamsWidgetStateComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamsWidgetStateComponent, "ga-teams-widget-state", never, { "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "empty": { "alias": "empty"; "required": false; "isSignal": true; }; "emptyMessageKey": { "alias": "emptyMessageKey"; "required": false; "isSignal": true; }; "skeletonRows": { "alias": "skeletonRows"; "required": false; "isSignal": true; }; }, { "retry": "retry"; }, never, ["*"], true, never>;
}
