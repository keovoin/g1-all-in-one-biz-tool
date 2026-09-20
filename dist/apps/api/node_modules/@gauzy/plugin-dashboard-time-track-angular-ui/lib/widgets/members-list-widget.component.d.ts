import { Signal } from '@angular/core';
import { NbComponentStatus } from '@nebular/theme';
import { Observable } from 'rxjs';
import { IMembersStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import { IWeekHourBar } from './time-track-widget.utils';
import * as i0 from "@angular/core";
/**
 * A member row plus its pre-computed weekly bar graph.
 *
 * The bars are derived once, when the payload arrives, instead of from a
 * template helper: a method called out of `@for` would rebuild all seven bars on
 * every change-detection pass.
 */
interface IMemberRow extends IMembersStatistics {
    /** Seven bars (Sunday..Saturday), each a share of the member's own week. */
    weekHourBars: IWeekHourBar[];
}
/**
 * List widget: per-member time and activity, today and over the selected range.
 *
 * Wraps the legacy dashboard's "Members" window — avatar, today's duration and
 * activity badge, the range's duration and activity badge, plus the little
 * per-day bar graph the legacy panel drew for ranges up to a week.
 *
 * NOTE: this is the LIST panel. The single number "how many members worked"
 * lives in the separate `time-tracking.members-worked` counter widget.
 */
export declare class MembersListWidgetComponent extends BaseTimeTrackListWidgetComponent<IMemberRow> {
    /** @inheritdoc */
    protected readonly emptyMessageBaseKey = "TIMESHEET.NO_MEMBER_ACTIVITY";
    /**
     * Whether the per-day bar graph is drawn.
     *
     * Beyond a week the seven bars no longer map onto seven real days, which is
     * exactly when the legacy panel dropped them too.
     */
    protected readonly showWeekGraph: Signal<boolean>;
    /** Header label of the range column: "This week" or "Over the period". */
    protected readonly rangeColumnKey: Signal<string>;
    /**
     * Reads the per-member statistics for the current scope.
     *
     * @param context - The dashboard context to query for.
     * @returns The member rows, with their weekly bars already normalized.
     */
    protected fetch(context: IDashboardWidgetContext): Observable<IMemberRow[]>;
    /**
     * Nebular status for an activity percentage, so the badges use the same
     * danger/warning/info/success scale as the rest of the app.
     *
     * @param value - A percentage between 0 and 100.
     * @returns The matching Nebular status name.
     */
    protected statusFor(value: number | undefined): NbComponentStatus;
    /**
     * Activity percentage rendered inside a member's badge.
     *
     * @param value - A percentage between 0 and 100.
     * @returns The percentage, e.g. `"64%"`.
     */
    protected activityLabel(value: number | undefined): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MembersListWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MembersListWidgetComponent, "gz-members-list-widget", never, {}, {}, never, never, true, never>;
}
export {};
