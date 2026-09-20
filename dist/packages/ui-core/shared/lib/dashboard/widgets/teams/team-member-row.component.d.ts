import { NbComponentStatus } from '@nebular/theme';
import { ITeamDashboardMember } from './teams-dashboard.types';
import * as i0 from "@angular/core";
/**
 * The compact member row of the Teams dashboard: status dot, avatar, how much of
 * the working day is logged, and the activity badge.
 *
 * Extracted from `gauzy-team-member` in its "classic" mode, and shared by every
 * Teams widget that lists people — the flat member list and the per-team overview
 * both render this exact row, so the chrome cannot drift between them.
 *
 * Purely presentational: it fetches nothing and owns no state.
 */
export declare class TeamMemberRowComponent {
    /** The member to render. */
    readonly member: import("@angular/core").InputSignal<ITeamDashboardMember>;
    /**
     * Whether to print the member's team under their name.
     *
     * Only useful in a FLAT list spanning several teams; inside a per-team card it
     * would repeat the card's own heading on every row.
     */
    readonly showTeamName: import("@angular/core").InputSignal<boolean>;
    /**
     * Share of the member's working day that is already logged.
     *
     * @returns A percentage between 0 and 100.
     */
    protected workedPercentage(): number;
    /**
     * Nebular status for a percentage, so the progress bars and activity badges
     * use the same danger/warning/info/success scale as the rest of the app.
     *
     * Accepts `null` because a member's activity legitimately has none — the
     * template guards the BADGE on that, but Angular does not narrow a
     * `member().activity` call expression across the surrounding `@if`.
     *
     * @param value - A percentage between 0 and 100, or `null`.
     * @returns The matching Nebular status name.
     */
    protected statusFor(value: number | null | undefined): NbComponentStatus;
    /**
     * Rounded activity percentage rendered inside the member's badge.
     *
     * Formatted here rather than through the decimal pipe so the row does not have
     * to pull `CommonModule` in just for one number.
     *
     * @returns The percentage, e.g. `"64%"`.
     */
    protected activityLabel(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamMemberRowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamMemberRowComponent, "ga-team-member-row", never, { "member": { "alias": "member"; "required": true; "isSignal": true; }; "showTeamName": { "alias": "showTeamName"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
