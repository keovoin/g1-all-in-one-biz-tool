import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many teams have somebody working, out of all teams in scope.
 *
 * Extracted from the first card of the legacy Teams dashboard
 * (`countWorking / countTeams`).
 */
export declare class TeamsCountWidgetComponent extends BaseTeamsWidgetComponent {
    /** Teams with at least one member working in the selected range. */
    protected readonly teamsWorking: import("@angular/core").Signal<number>;
    /** Teams in scope — the counter-point denominator. */
    protected readonly teamsTotal: import("@angular/core").Signal<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamsCountWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamsCountWidgetComponent, "ga-teams-count-widget", never, {}, {}, never, never, true, never>;
}
