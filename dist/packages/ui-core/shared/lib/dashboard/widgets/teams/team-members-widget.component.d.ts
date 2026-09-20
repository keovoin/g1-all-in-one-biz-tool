import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { ITeamDashboardMember } from './teams-dashboard.types';
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
export declare class TeamMembersWidgetComponent extends BaseTeamsWidgetComponent {
    /** Every member row across the teams in scope, working members first. */
    protected readonly members: import("@angular/core").Signal<ITeamDashboardMember[]>;
    /** True when more than one team is in scope, which is when the row needs its team name. */
    protected readonly showTeamName: import("@angular/core").Signal<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamMembersWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamMembersWidgetComponent, "ga-team-members-widget", never, {}, {}, never, never, true, never>;
}
