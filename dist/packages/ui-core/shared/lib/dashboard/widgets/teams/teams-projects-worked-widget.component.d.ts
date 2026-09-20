import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many projects the teams logged time against.
 *
 * Extracted from the third card of the legacy Teams dashboard. The numerator is
 * derived from the teams' own time logs (so it follows the team/employee scope),
 * while the denominator is the organization's total project count.
 */
export declare class TeamsProjectsWorkedWidgetComponent extends BaseTeamsWidgetComponent {
    /** Distinct projects that received logged time in the range. */
    protected readonly projectsWorked: import("@angular/core").Signal<number>;
    /** Projects in the organization — the counter-point denominator. */
    protected readonly projectsTotal: import("@angular/core").Signal<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamsProjectsWorkedWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamsProjectsWorkedWidgetComponent, "ga-teams-projects-worked-widget", never, {}, {}, never, never, true, never>;
}
