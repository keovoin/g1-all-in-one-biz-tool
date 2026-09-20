import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: total duration worked over the selected period.
 *
 * The host header always reads "Worked This Week" (the registry title), so the
 * widget adds a caption whenever the selected range is something else — the
 * legacy dashboard conveyed the same thing by rewriting its card title, which a
 * canvas widget cannot do.
 */
export declare class WorkedThisWeekWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    /** Seconds worked over the selected range. */
    protected readonly weekDuration: import("@angular/core").Signal<number>;
    /** Range-aware caption; `null` when the host title already says it. */
    protected readonly captionKey: import("@angular/core").Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkedThisWeekWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkedThisWeekWidgetComponent, "gz-worked-this-week-widget", never, {}, {}, never, never, true, never>;
}
