import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { ITeamDashboardTeam } from './teams-dashboard.types';
import * as i0 from "@angular/core";
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
export declare class TeamOverviewWidgetComponent extends BaseTeamsWidgetComponent {
    /**
     * Teams in scope, in the order the API returned them.
     *
     * Their `members` are already ordered working-first by the snapshot service,
     * which is the order the legacy card rendered
     * (`membersWorkingToday.concat(membersNotWorkingToday)`).
     */
    protected readonly teams: import("@angular/core").Signal<ITeamDashboardTeam[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamOverviewWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamOverviewWidgetComponent, "ga-team-overview-widget", never, {}, {}, never, never, true, never>;
}
