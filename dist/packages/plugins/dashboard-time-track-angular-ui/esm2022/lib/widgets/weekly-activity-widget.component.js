import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import { TimeTrackCounterCardComponent } from './time-track-counter-card.component';
import { RangePeriod } from './time-track-widget.utils';
import * as i0 from "@angular/core";
/**
 * Counter widget: overall activity percentage for the selected period,
 * rendered as a progress bar.
 *
 * Like its duration sibling, it captions the number with the selected range so a
 * month-long selection does not silently read as "Weekly Activity".
 */
export class WeeklyActivityWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    constructor() {
        super(...arguments);
        /** Activity percentage over the selected range. */
        this.weekActivity = computed(() => this.counts()?.weekActivities ?? 0, ...(ngDevMode ? [{ debugName: "weekActivity" }] : []));
        /** Range-aware caption; `null` when the host title already says it. */
        this.captionKey = computed(() => {
            switch (this.rangePeriod()) {
                case RangePeriod.PERIOD:
                    return 'TIMESHEET.ACTIVITY_OVER_PERIOD';
                case RangePeriod.DAY:
                    return 'TIMESHEET.ACTIVITY_FOR_DAY';
                default:
                    // The host header already reads "Weekly Activity".
                    return null;
            }
        }, ...(ngDevMode ? [{ debugName: "captionKey" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WeeklyActivityWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: WeeklyActivityWidgetComponent, isStandalone: true, selector: "gz-weekly-activity-widget", usesInheritance: true, ngImport: i0, template: "<gz-time-track-counter-card\n\t[captionKey]=\"captionKey()\"\n\t[progress]=\"true\"\n\t[value]=\"weekActivity() + '%'\"\n\t[counterValue]=\"weekActivity()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n", dependencies: [{ kind: "component", type: TimeTrackCounterCardComponent, selector: "gz-time-track-counter-card", inputs: ["captionKey", "value", "counterValue", "total", "color", "progress", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WeeklyActivityWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-weekly-activity-widget', standalone: true, imports: [TimeTrackCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-counter-card\n\t[captionKey]=\"captionKey()\"\n\t[progress]=\"true\"\n\t[value]=\"weekActivity() + '%'\"\n\t[counterValue]=\"weekActivity()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n" }]
        }] });
//# sourceMappingURL=weekly-activity-widget.component.js.map