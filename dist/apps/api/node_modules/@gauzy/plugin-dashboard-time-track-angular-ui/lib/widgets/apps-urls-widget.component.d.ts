import { Observable } from 'rxjs';
import { IActivitiesStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import * as i0 from "@angular/core";
/**
 * List widget: which applications and URLs the tracked time was spent in.
 *
 * Wraps the legacy dashboard's "Apps & URLs" window, and reuses the very same
 * row component (`ngx-activity-item` in its `isDashboard` mode) rather than
 * re-implementing the title / share / duration layout.
 */
export declare class AppsUrlsWidgetComponent extends BaseTimeTrackListWidgetComponent<IActivitiesStatistics> {
    private readonly _router;
    /** @inheritdoc */
    protected readonly emptyMessageBaseKey = "TIMESHEET.NO_APP_URL_ACTIVITY";
    /**
     * Reads the app / URL activity buckets for the current scope.
     *
     * The share each row renders is the one the API computed against the whole
     * reporting period, not one re-derived from the five rows it returned — see
     * {@link normalizeDurationPercentage} for why the legacy dashboard's local
     * re-computation inflates every row. The helper only makes that server value
     * renderable (finite, clamped).
     *
     * @param context - The dashboard context to query for.
     * @returns The activity rows with a renderable `durationPercentage`.
     */
    protected fetch(context: IDashboardWidgetContext): Observable<IActivitiesStatistics[]>;
    /**
     * Opens the Apps & URLs report for the widget's own reporting window.
     *
     * The range comes from the widget context rather than the page selectors: a
     * canvas widget may be pinned to a range the header no longer shows.
     */
    protected openReport(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppsUrlsWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppsUrlsWidgetComponent, "gz-apps-urls-widget", never, {}, {}, never, never, true, never>;
}
