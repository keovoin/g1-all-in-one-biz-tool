import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: total duration worked today across the current scope,
 * rendered as `HH:mm:ss` against the range's workable capacity.
 */
export declare class WorkedTodayWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    /** Seconds worked today. */
    protected readonly todayDuration: import("@angular/core").Signal<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkedTodayWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkedTodayWidgetComponent, "gz-worked-today-widget", never, {}, {}, never, never, true, never>;
}
