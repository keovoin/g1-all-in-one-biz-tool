import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamsCounterCardComponent } from './teams-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many projects the teams logged time against.
 *
 * Extracted from the third card of the legacy Teams dashboard. The numerator is
 * derived from the teams' own time logs (so it follows the team/employee scope),
 * while the denominator is the organization's total project count.
 */
export class TeamsProjectsWorkedWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /** Distinct projects that received logged time in the range. */
        this.projectsWorked = computed(() => this.snapshot()?.projectsWorked ?? 0, ...(ngDevMode ? [{ debugName: "projectsWorked" }] : []));
        /** Projects in the organization — the counter-point denominator. */
        this.projectsTotal = computed(() => this.snapshot()?.projectsTotal ?? 0, ...(ngDevMode ? [{ debugName: "projectsTotal" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsProjectsWorkedWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TeamsProjectsWorkedWidgetComponent, isStandalone: true, selector: "ga-teams-projects-worked-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-counter-card\n\t[value]=\"projectsWorked().toString()\"\n\t[suffix]=\"'/' + projectsTotal()\"\n\t[counterValue]=\"projectsWorked()\"\n\t[total]=\"projectsTotal()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n", dependencies: [{ kind: "component", type: TeamsCounterCardComponent, selector: "ga-teams-counter-card", inputs: ["value", "suffix", "counterValue", "total", "color", "progress", "captionKey", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsProjectsWorkedWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-teams-projects-worked-widget', standalone: true, imports: [TeamsCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-counter-card\n\t[value]=\"projectsWorked().toString()\"\n\t[suffix]=\"'/' + projectsTotal()\"\n\t[counterValue]=\"projectsWorked()\"\n\t[total]=\"projectsTotal()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n" }]
        }] });
//# sourceMappingURL=teams-projects-worked-widget.component.js.map