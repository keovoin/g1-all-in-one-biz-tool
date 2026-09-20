import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: overall activity percentage for the selected period,
 * rendered as a progress bar.
 *
 * Like its duration sibling, it captions the number with the selected range so a
 * month-long selection does not silently read as "Weekly Activity".
 */
export declare class WeeklyActivityWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    /** Activity percentage over the selected range. */
    protected readonly weekActivity: import("@angular/core").Signal<number>;
    /** Range-aware caption; `null` when the host title already says it. */
    protected readonly captionKey: import("@angular/core").Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WeeklyActivityWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WeeklyActivityWidgetComponent, "gz-weekly-activity-widget", never, {}, {}, never, never, true, never>;
}
