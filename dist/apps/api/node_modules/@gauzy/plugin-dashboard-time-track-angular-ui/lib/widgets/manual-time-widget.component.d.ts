import { IManualTimesStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { Observable } from 'rxjs';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import * as i0 from "@angular/core";
/**
 * List widget: time entries that were added by hand rather than tracked.
 *
 * Wraps the legacy dashboard's "Manual Time" window — same rows (member,
 * project, duration, date) and the same jump into the Manual Time Edits report.
 */
export declare class ManualTimeWidgetComponent extends BaseTimeTrackListWidgetComponent<IManualTimesStatistics> {
    private readonly _router;
    /** @inheritdoc */
    protected readonly emptyMessageBaseKey = "TIMESHEET.NO_MANUAL_TIME";
    /**
     * Reads the manual time entries for the current scope.
     *
     * @param context - The dashboard context to query for.
     * @returns The manual time rows.
     */
    protected fetch(context: IDashboardWidgetContext): Observable<IManualTimesStatistics[]>;
    /**
     * Opens the Manual Time Edits report for the widget's own reporting window.
     *
     * The range comes from the widget context rather than the page selectors: a
     * canvas widget may be pinned to a range the header no longer shows, and
     * landing on a report for a different period would be a silent lie.
     */
    protected openReport(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ManualTimeWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ManualTimeWidgetComponent, "gz-manual-time-widget", never, {}, {}, never, never, true, never>;
}
