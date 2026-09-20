import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamSummaryCardComponent } from './team-summary-card.component';
import { TeamsWidgetStateComponent } from './teams-widget-state.component';
import * as i0 from "@angular/core";
/**
 * Grid of one card per team: working members over total members, plus the
 * working-now / working-today / not-working legend.
 *
 * Extracted from the masonry section of the legacy Teams dashboard (which merges
 * `gauzy-team-card` and the per-team header of `gauzy-all-team`). The member
 * rows those cards nest are widgets of their own — see `TeamMembersWidgetComponent`
 * for the flat list and `TeamOverviewWidgetComponent` for the nested masonry — so
 * this one stays readable at three columns.
 */
export class TeamCardsWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /** Teams in scope, in the order the API returned them. */
        this.teams = computed(() => this.snapshot()?.teams ?? [], ...(ngDevMode ? [{ debugName: "teams" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamCardsWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamCardsWidgetComponent, isStandalone: true, selector: "ga-team-cards-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"teams().length === 0\"\n\t[skeletonRows]=\"2\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"team-cards\">\n\t\t@for (team of teams(); track team.id) {\n\t\t\t<ga-team-summary-card [team]=\"team\"></ga-team-summary-card>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.team-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem;height:100%;overflow-y:auto;padding-right:.25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: TeamSummaryCardComponent, selector: "ga-team-summary-card", inputs: ["team", "showCounter"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamCardsWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-cards-widget', standalone: true, imports: [TeamSummaryCardComponent, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"teams().length === 0\"\n\t[skeletonRows]=\"2\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"team-cards\">\n\t\t@for (team of teams(); track team.id) {\n\t\t\t<ga-team-summary-card [team]=\"team\"></ga-team-summary-card>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.team-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem;height:100%;overflow-y:auto;padding-right:.25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=team-cards-widget.component.js.map