import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DurationFormatPipe } from '@gauzy/ui-core/shared';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import { TimeTrackCounterCardComponent } from './time-track-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: total duration worked today across the current scope,
 * rendered as `HH:mm:ss` against the range's workable capacity.
 */
export class WorkedTodayWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    constructor() {
        super(...arguments);
        /** Seconds worked today. */
        this.todayDuration = computed(() => this.counts()?.todayDuration ?? 0, ...(ngDevMode ? [{ debugName: "todayDuration" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkedTodayWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: WorkedTodayWidgetComponent, isStandalone: true, selector: "gz-worked-today-widget", usesInheritance: true, ngImport: i0, template: "<gz-time-track-counter-card\n\tcolor=\"success\"\n\t[value]=\"todayDuration() | durationFormat\"\n\t[counterValue]=\"todayDuration()\"\n\t[total]=\"periodSeconds()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n", dependencies: [{ kind: "component", type: TimeTrackCounterCardComponent, selector: "gz-time-track-counter-card", inputs: ["captionKey", "value", "counterValue", "total", "color", "progress", "loading", "error"], outputs: ["retry"] }, { kind: "pipe", type: DurationFormatPipe, name: "durationFormat" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkedTodayWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-worked-today-widget', standalone: true, imports: [DurationFormatPipe, TimeTrackCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-counter-card\n\tcolor=\"success\"\n\t[value]=\"todayDuration() | durationFormat\"\n\t[counterValue]=\"todayDuration()\"\n\t[total]=\"periodSeconds()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n" }]
        }] });
//# sourceMappingURL=worked-today-widget.component.js.map