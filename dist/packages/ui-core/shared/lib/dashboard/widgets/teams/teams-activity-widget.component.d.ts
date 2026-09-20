import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: overall activity percentage of the teams in the selected range.
 *
 * Extracted from the fourth card of the legacy Teams dashboard
 * ("Worked for the day"), which renders `counts.weekActivities` as a progress bar.
 * The counts request is scoped to the teams' members, so the number answers "how
 * active were these teams", not "how active was the whole organization".
 */
export declare class TeamsActivityWidgetComponent extends BaseTeamsWidgetComponent {
    /** Activity percentage, clamped to the 0..100 the progress bar can render. */
    protected readonly activity: import("@angular/core").Signal<number>;
    /** Rounded value shown as the headline figure. */
    protected readonly activityLabel: import("@angular/core").Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamsActivityWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamsActivityWidgetComponent, "ga-teams-activity-widget", never, {}, {}, never, never, true, never>;
}
