import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DurationFormatPipe } from '@gauzy/ui-core/shared';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import { TimeTrackCounterCardComponent } from './time-track-counter-card.component';
import { RangePeriod } from './time-track-widget.utils';
import * as i0 from "@angular/core";
/**
 * Counter widget: total duration worked over the selected period.
 *
 * The host header always reads "Worked This Week" (the registry title), so the
 * widget adds a caption whenever the selected range is something else — the
 * legacy dashboard conveyed the same thing by rewriting its card title, which a
 * canvas widget cannot do.
 */
export class WorkedThisWeekWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    constructor() {
        super(...arguments);
        /** Seconds worked over the selected range. */
        this.weekDuration = computed(() => this.counts()?.weekDuration ?? 0, ...(ngDevMode ? [{ debugName: "weekDuration" }] : []));
        /** Range-aware caption; `null` when the host title already says it. */
        this.captionKey = computed(() => {
            switch (this.rangePeriod()) {
                case RangePeriod.PERIOD:
                    return 'TIMESHEET.WORKED_OVER_PERIOD';
                case RangePeriod.DAY:
                    return 'TIMESHEET.WORKED_FOR_DAY';
                default:
                    return this.isCurrentWeek() ? null : 'TIMESHEET.WORKED_FOR_WEEK';
            }
        }, ...(ngDevMode ? [{ debugName: "captionKey" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkedThisWeekWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: WorkedThisWeekWidgetComponent, isStandalone: true, selector: "gz-worked-this-week-widget", usesInheritance: true, ngImport: i0, template: "<gz-time-track-counter-card\n\tcolor=\"success\"\n\t[captionKey]=\"captionKey()\"\n\t[value]=\"weekDuration() | durationFormat\"\n\t[counterValue]=\"weekDuration()\"\n\t[total]=\"periodSeconds()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n", dependencies: [{ kind: "component", type: TimeTrackCounterCardComponent, selector: "gz-time-track-counter-card", inputs: ["captionKey", "value", "counterValue", "total", "color", "progress", "loading", "error"], outputs: ["retry"] }, { kind: "pipe", type: DurationFormatPipe, name: "durationFormat" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkedThisWeekWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-worked-this-week-widget', standalone: true, imports: [DurationFormatPipe, TimeTrackCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-counter-card\n\tcolor=\"success\"\n\t[captionKey]=\"captionKey()\"\n\t[value]=\"weekDuration() | durationFormat\"\n\t[counterValue]=\"weekDuration()\"\n\t[total]=\"periodSeconds()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n" }]
        }] });
//# sourceMappingURL=worked-this-week-widget.component.js.map