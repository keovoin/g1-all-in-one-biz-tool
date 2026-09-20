import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamMemberRowComponent } from './team-member-row.component';
import { TeamSummaryCardComponent } from './team-summary-card.component';
import { TeamsWidgetStateComponent } from './teams-widget-state.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
/**
 * The full per-team overview: one card per team, each showing the team's
 * headline numbers AND the members behind them.
 *
 * This is the masonry section of the legacy Teams dashboard (`gauzy-all-team`),
 * the view a user lands on before drilling into a single team. It is the
 * composition of the two narrower Teams widgets — `ga-team-summary-card` for the
 * heading and `ga-team-member-row` for the people — reused verbatim rather than
 * re-implemented, so all three widgets stay visually identical.
 *
 * The legacy card also carried a "drill into this team" arrow. It is deliberately
 * absent: on a canvas there is no second view to drill INTO, and the drill-down
 * the button opened is what the Team Member Details widget renders directly.
 */
export class TeamOverviewWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /**
         * Teams in scope, in the order the API returned them.
         *
         * Their `members` are already ordered working-first by the snapshot service,
         * which is the order the legacy card rendered
         * (`membersWorkingToday.concat(membersNotWorkingToday)`).
         */
        this.teams = computed(() => this.snapshot()?.teams ?? [], ...(ngDevMode ? [{ debugName: "teams" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamOverviewWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamOverviewWidgetComponent, isStandalone: true, selector: "ga-team-overview-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"teams().length === 0\"\n\t[skeletonRows]=\"3\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_OVERVIEW.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"team-overview\">\n\t\t@for (team of teams(); track team.id) {\n\t\t\t<section class=\"team-overview-card\">\n\t\t\t\t<ga-team-summary-card [team]=\"team\" [showCounter]=\"false\"></ga-team-summary-card>\n\n\t\t\t\t<div class=\"team-overview-members\">\n\t\t\t\t\t@for (member of team.members; track member.id) {\n\t\t\t\t\t\t<ga-team-member-row [member]=\"member\"></ga-team-member-row>\n\t\t\t\t\t} @empty {\n\t\t\t\t\t\t<div class=\"team-overview-empty\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_OVERVIEW.NO_MEMBERS' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.team-overview{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));align-items:start;gap:.75rem;height:100%;overflow-y:auto;padding-right:.25rem}.team-overview-card{display:flex;flex-direction:column;gap:.5rem;min-width:0}.team-overview-members{display:flex;flex-direction:column;gap:.25rem;min-width:0}.team-overview-empty{padding:.5rem;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: TranslateModule }, { kind: "component", type: TeamMemberRowComponent, selector: "ga-team-member-row", inputs: ["member", "showTeamName"] }, { kind: "component", type: TeamSummaryCardComponent, selector: "ga-team-summary-card", inputs: ["team", "showCounter"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamOverviewWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-overview-widget', standalone: true, imports: [TranslateModule, TeamMemberRowComponent, TeamSummaryCardComponent, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"teams().length === 0\"\n\t[skeletonRows]=\"3\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_OVERVIEW.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"team-overview\">\n\t\t@for (team of teams(); track team.id) {\n\t\t\t<section class=\"team-overview-card\">\n\t\t\t\t<ga-team-summary-card [team]=\"team\" [showCounter]=\"false\"></ga-team-summary-card>\n\n\t\t\t\t<div class=\"team-overview-members\">\n\t\t\t\t\t@for (member of team.members; track member.id) {\n\t\t\t\t\t\t<ga-team-member-row [member]=\"member\"></ga-team-member-row>\n\t\t\t\t\t} @empty {\n\t\t\t\t\t\t<div class=\"team-overview-empty\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_OVERVIEW.NO_MEMBERS' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.team-overview{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));align-items:start;gap:.75rem;height:100%;overflow-y:auto;padding-right:.25rem}.team-overview-card{display:flex;flex-direction:column;gap:.5rem;min-width:0}.team-overview-members{display:flex;flex-direction:column;gap:.25rem;min-width:0}.team-overview-empty{padding:.5rem;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=team-overview-widget.component.js.map