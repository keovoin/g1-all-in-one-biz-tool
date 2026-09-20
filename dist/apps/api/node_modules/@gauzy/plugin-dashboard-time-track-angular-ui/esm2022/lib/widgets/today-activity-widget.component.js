import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import { TimeTrackCounterCardComponent } from './time-track-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: today's overall activity percentage (keyboard/mouse activity
 * recorded by the desktop tracker), rendered as a progress bar.
 */
export class TodayActivityWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    constructor() {
        super(...arguments);
        /** Today's activity percentage. */
        this.todayActivity = computed(() => this.counts()?.todayActivities ?? 0, ...(ngDevMode ? [{ debugName: "todayActivity" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TodayActivityWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TodayActivityWidgetComponent, isStandalone: true, selector: "gz-today-activity-widget", usesInheritance: true, ngImport: i0, template: "<gz-time-track-counter-card\n\t[progress]=\"true\"\n\t[value]=\"todayActivity() + '%'\"\n\t[counterValue]=\"todayActivity()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n", dependencies: [{ kind: "component", type: TimeTrackCounterCardComponent, selector: "gz-time-track-counter-card", inputs: ["captionKey", "value", "counterValue", "total", "color", "progress", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TodayActivityWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-today-activity-widget', standalone: true, imports: [TimeTrackCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-counter-card\n\t[progress]=\"true\"\n\t[value]=\"todayActivity() + '%'\"\n\t[counterValue]=\"todayActivity()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n" }]
        }] });
//# sourceMappingURL=today-activity-widget.component.js.map