import { ITeamDashboardTeam } from './teams-dashboard.types';
import * as i0 from "@angular/core";
/**
 * Headline of one team: working members over total, the team's name, and the
 * working-now / working-today / not-working legend.
 *
 * Extracted from the masonry card header of the legacy Teams dashboard (which
 * merges `gauzy-team-card` and the per-team header of `gauzy-all-team`) and
 * shared by the Team Cards grid and the per-team overview, so the two cannot
 * disagree about what a team's numbers look like.
 *
 * Purely presentational: it fetches nothing and owns no state.
 */
export declare class TeamSummaryCardComponent {
    /** The team to summarize. */
    readonly team: import("@angular/core").InputSignal<ITeamDashboardTeam>;
    /**
     * Whether to draw the counter-point strip under the legend.
     *
     * The overview widget hides it: there the strip sits directly above the team's
     * own member rows, which already convey the same working/idle split.
     */
    readonly showCounter: import("@angular/core").InputSignal<boolean>;
    /**
     * Members that logged time but have no timer running right now.
     *
     * Computed rather than subtracted in the template because the difference can
     * go negative for a fraction of a second while a snapshot is being replaced,
     * and a "-1" badge is worse than a "0" one.
     */
    protected readonly workingToday: import("@angular/core").Signal<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamSummaryCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamSummaryCardComponent, "ga-team-summary-card", never, { "team": { "alias": "team"; "required": true; "isSignal": true; }; "showCounter": { "alias": "showCounter"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
