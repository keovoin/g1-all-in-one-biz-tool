import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamsCounterCardComponent } from './teams-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many team members logged time in the selected range.
 *
 * Extracted from the second card of the legacy Teams dashboard. Unlike the Time
 * Tracking "Members worked" counter this one is scoped to TEAM MEMBERSHIP: its
 * denominator is the number of people on the teams in scope, not the
 * organization's head count, and somebody on two teams still counts once.
 */
export class TeamsMembersWorkedWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /** Distinct members that logged time in the range. */
        this.membersWorked = computed(() => this.snapshot()?.membersWorked ?? 0, ...(ngDevMode ? [{ debugName: "membersWorked" }] : []));
        /** Distinct members across the teams in scope — the counter-point denominator. */
        this.membersTotal = computed(() => this.snapshot()?.membersTotal ?? 0, ...(ngDevMode ? [{ debugName: "membersTotal" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsMembersWorkedWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TeamsMembersWorkedWidgetComponent, isStandalone: true, selector: "ga-teams-members-worked-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-counter-card\n\t[value]=\"membersWorked().toString()\"\n\t[suffix]=\"'/' + membersTotal()\"\n\t[counterValue]=\"membersWorked()\"\n\t[total]=\"membersTotal()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n", dependencies: [{ kind: "component", type: TeamsCounterCardComponent, selector: "ga-teams-counter-card", inputs: ["value", "suffix", "counterValue", "total", "color", "progress", "captionKey", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsMembersWorkedWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-teams-members-worked-widget', standalone: true, imports: [TeamsCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-counter-card\n\t[value]=\"membersWorked().toString()\"\n\t[suffix]=\"'/' + membersTotal()\"\n\t[counterValue]=\"membersWorked()\"\n\t[total]=\"membersTotal()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n" }]
        }] });
//# sourceMappingURL=teams-members-worked-widget.component.js.map