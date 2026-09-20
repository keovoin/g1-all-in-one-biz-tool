import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamMemberRowComponent } from './team-member-row.component';
import { TeamsWidgetStateComponent } from './teams-widget-state.component';
import * as i0 from "@angular/core";
/**
 * Flat list of every team member in scope: status dot, avatar, how much of the
 * working day they logged, and their activity percentage.
 *
 * Extracted from `gauzy-team-member` in its "classic" mode — the compact row the
 * legacy Teams dashboard renders inside each team card. Working members come
 * first, matching the legacy order, and a person on two teams appears once per
 * team (their numbers differ per team, because time is logged against a team).
 *
 * The row itself is `ga-team-member-row`, shared with the per-team overview
 * widget; this component only decides WHICH rows to show and in what order.
 */
export class TeamMembersWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /** Every member row across the teams in scope, working members first. */
        this.members = computed(() => (this.snapshot()?.teams ?? []).flatMap((team) => team.members), ...(ngDevMode ? [{ debugName: "members" }] : []));
        /** True when more than one team is in scope, which is when the row needs its team name. */
        this.showTeamName = computed(() => (this.snapshot()?.teams ?? []).length > 1, ...(ngDevMode ? [{ debugName: "showTeamName" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamMembersWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamMembersWidgetComponent, isStandalone: true, selector: "ga-team-members-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"members().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_MEMBERS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"member-list\">\n\t\t@for (member of members(); track member.id) {\n\t\t\t<ga-team-member-row [member]=\"member\" [showTeamName]=\"showTeamName()\"></ga-team-member-row>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.member-list{display:flex;flex-direction:column;gap:.25rem;height:100%;overflow-y:auto;padding-right:.25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: TeamMemberRowComponent, selector: "ga-team-member-row", inputs: ["member", "showTeamName"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamMembersWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-members-widget', standalone: true, imports: [TeamMemberRowComponent, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"members().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_MEMBERS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"member-list\">\n\t\t@for (member of members(); track member.id) {\n\t\t\t<ga-team-member-row [member]=\"member\" [showTeamName]=\"showTeamName()\"></ga-team-member-row>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.member-list{display:flex;flex-direction:column;gap:.25rem;height:100%;overflow-y:auto;padding-right:.25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=team-members-widget.component.js.map