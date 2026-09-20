import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamsCounterCardComponent } from './teams-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many teams have somebody working, out of all teams in scope.
 *
 * Extracted from the first card of the legacy Teams dashboard
 * (`countWorking / countTeams`).
 */
export class TeamsCountWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /** Teams with at least one member working in the selected range. */
        this.teamsWorking = computed(() => this.snapshot()?.teamsWorking ?? 0, ...(ngDevMode ? [{ debugName: "teamsWorking" }] : []));
        /** Teams in scope — the counter-point denominator. */
        this.teamsTotal = computed(() => this.snapshot()?.teamsTotal ?? 0, ...(ngDevMode ? [{ debugName: "teamsTotal" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsCountWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TeamsCountWidgetComponent, isStandalone: true, selector: "ga-teams-count-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-counter-card\n\t[value]=\"teamsWorking().toString()\"\n\t[suffix]=\"'/' + teamsTotal()\"\n\t[counterValue]=\"teamsWorking()\"\n\t[total]=\"teamsTotal()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n", dependencies: [{ kind: "component", type: TeamsCounterCardComponent, selector: "ga-teams-counter-card", inputs: ["value", "suffix", "counterValue", "total", "color", "progress", "captionKey", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsCountWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-teams-count-widget', standalone: true, imports: [TeamsCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-counter-card\n\t[value]=\"teamsWorking().toString()\"\n\t[suffix]=\"'/' + teamsTotal()\"\n\t[counterValue]=\"teamsWorking()\"\n\t[total]=\"teamsTotal()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-teams-counter-card>\n" }]
        }] });
//# sourceMappingURL=teams-count-widget.component.js.map