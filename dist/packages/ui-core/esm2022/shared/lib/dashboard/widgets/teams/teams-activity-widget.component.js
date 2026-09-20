import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamsCounterCardComponent } from './teams-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: overall activity percentage of the teams in the selected range.
 *
 * Extracted from the fourth card of the legacy Teams dashboard
 * ("Worked for the day"), which renders `counts.weekActivities` as a progress bar.
 * The counts request is scoped to the teams' members, so the number answers "how
 * active were these teams", not "how active was the whole organization".
 */
export class TeamsActivityWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /** Activity percentage, clamped to the 0..100 the progress bar can render. */
        this.activity = computed(() => {
            const value = this.snapshot()?.activityPercentage ?? 0;
            return Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
        }, ...(ngDevMode ? [{ debugName: "activity" }] : []));
        /** Rounded value shown as the headline figure. */
        this.activityLabel = computed(() => Math.round(this.activity()).toString(), ...(ngDevMode ? [{ debugName: "activityLabel" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsActivityWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TeamsActivityWidgetComponent, isStandalone: true, selector: "ga-teams-activity-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-counter-card\n\t[value]=\"activityLabel()\"\n\tsuffix=\"%\"\n\t[counterValue]=\"activity()\"\n\t[total]=\"100\"\n\t[progress]=\"true\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n", dependencies: [{ kind: "component", type: TeamsCounterCardComponent, selector: "ga-teams-counter-card", inputs: ["value", "suffix", "counterValue", "total", "color", "progress", "captionKey", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsActivityWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-teams-activity-widget', standalone: true, imports: [TeamsCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-counter-card\n\t[value]=\"activityLabel()\"\n\tsuffix=\"%\"\n\t[counterValue]=\"activity()\"\n\t[total]=\"100\"\n\t[progress]=\"true\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n" }]
        }] });
//# sourceMappingURL=teams-activity-widget.component.js.map