import { NbComponentStatus } from '@nebular/theme';
import { Observable } from 'rxjs';
import { IProjectsStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import * as i0 from "@angular/core";
/**
 * List widget: how the tracked time of the selected range splits across projects.
 *
 * Wraps the legacy dashboard's "Projects" window. Unlike the Tasks panel it has
 * no "view all" action, because the legacy window had none either — the project
 * breakdown is the report.
 *
 * NOTE: this is the LIST panel. The single number "how many projects were worked
 * on" lives in the separate `time-tracking.projects-worked` counter widget.
 */
export declare class ProjectsListWidgetComponent extends BaseTimeTrackListWidgetComponent<IProjectsStatistics> {
    /** @inheritdoc */
    protected readonly emptyMessageBaseKey = "TIMESHEET.NO_PROJECT_ACTIVITY";
    /**
     * Reads the per-project statistics for the current scope.
     *
     * @param context - The dashboard context to query for.
     * @returns The project rows, highest duration first.
     */
    protected fetch(context: IDashboardWidgetContext): Observable<IProjectsStatistics[]>;
    /**
     * Rounded share of the range's tracked time that went into a project.
     *
     * @param project - The row being rendered.
     * @returns A percentage between 0 and 100.
     */
    protected sharePercentage(project: IProjectsStatistics): number;
    /**
     * Nebular status for a percentage, so the bars use the same
     * danger/warning/info/success scale as the rest of the app.
     *
     * @param value - A percentage between 0 and 100.
     * @returns The matching Nebular status name.
     */
    protected statusFor(value: number): NbComponentStatus;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectsListWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectsListWidgetComponent, "gz-projects-list-widget", never, {}, {}, never, never, true, never>;
}
