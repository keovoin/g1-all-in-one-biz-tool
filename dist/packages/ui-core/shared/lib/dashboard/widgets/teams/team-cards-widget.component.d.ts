import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { ITeamDashboardTeam } from './teams-dashboard.types';
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
export declare class TeamCardsWidgetComponent extends BaseTeamsWidgetComponent {
    /** Teams in scope, in the order the API returned them. */
    protected readonly teams: import("@angular/core").Signal<ITeamDashboardTeam[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamCardsWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamCardsWidgetComponent, "ga-team-cards-widget", never, {}, {}, never, never, true, never>;
}
