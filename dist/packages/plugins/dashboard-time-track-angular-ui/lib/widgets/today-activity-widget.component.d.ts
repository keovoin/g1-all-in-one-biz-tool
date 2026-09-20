import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: today's overall activity percentage (keyboard/mouse activity
 * recorded by the desktop tracker), rendered as a progress bar.
 */
export declare class TodayActivityWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    /** Today's activity percentage. */
    protected readonly todayActivity: import("@angular/core").Signal<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TodayActivityWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TodayActivityWidgetComponent, "gz-today-activity-widget", never, {}, {}, never, never, true, never>;
}
