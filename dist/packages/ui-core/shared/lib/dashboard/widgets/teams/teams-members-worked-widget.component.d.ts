import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many team members logged time in the selected range.
 *
 * Extracted from the second card of the legacy Teams dashboard. Unlike the Time
 * Tracking "Members worked" counter this one is scoped to TEAM MEMBERSHIP: its
 * denominator is the number of people on the teams in scope, not the
 * organization's head count, and somebody on two teams still counts once.
 */
export declare class TeamsMembersWorkedWidgetComponent extends BaseTeamsWidgetComponent {
    /** Distinct members that logged time in the range. */
    protected readonly membersWorked: import("@angular/core").Signal<number>;
    /** Distinct members across the teams in scope — the counter-point denominator. */
    protected readonly membersTotal: import("@angular/core").Signal<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamsMembersWorkedWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamsMembersWorkedWidgetComponent, "ga-teams-members-worked-widget", never, {}, {}, never, never, true, never>;
}
