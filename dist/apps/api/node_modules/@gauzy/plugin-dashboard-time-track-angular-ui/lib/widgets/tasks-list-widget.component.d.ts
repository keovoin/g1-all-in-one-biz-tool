import { NbComponentStatus } from '@nebular/theme';
import { Observable } from 'rxjs';
import { ITasksStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import * as i0 from "@angular/core";
/**
 * List widget: the tasks that absorbed the most time in the selected range.
 *
 * Wraps the legacy dashboard's "Tasks" window: same top-N rows (title, share of
 * the range, duration) and the same jump into the Tasks dashboard.
 */
export declare class TasksListWidgetComponent extends BaseTimeTrackListWidgetComponent<ITasksStatistics> {
    private readonly _router;
    /** @inheritdoc */
    protected readonly emptyMessageBaseKey = "TIMESHEET.NO_TASK_ACTIVITY";
    /**
     * Reads the task statistics for the current scope.
     *
     * The page size is left at the cache service's default (5, the number the
     * legacy dashboard requests) on purpose: `take` is part of the cache key, so
     * asking for a different one here would open a second, non-shared entry for
     * the very same scope.
     *
     * @param context - The dashboard context to query for.
     * @returns The task rows, highest duration first.
     */
    protected fetch(context: IDashboardWidgetContext): Observable<ITasksStatistics[]>;
    /**
     * Rounded share of the range's tracked time that went into a task.
     *
     * Rounded here rather than through the decimal pipe so the widget does not
     * pull `CommonModule` in for one number.
     *
     * @param task - The row being rendered.
     * @returns A percentage between 0 and 100.
     */
    protected sharePercentage(task: ITasksStatistics): number;
    /**
     * Nebular status for a percentage, so the bars use the same
     * danger/warning/info/success scale as the rest of the app.
     *
     * @param value - A percentage between 0 and 100.
     * @returns The matching Nebular status name.
     */
    protected statusFor(value: number): NbComponentStatus;
    /** Opens the Tasks dashboard, matching the legacy panel's "View all". */
    protected openTasks(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TasksListWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TasksListWidgetComponent, "gz-tasks-list-widget", never, {}, {}, never, never, true, never>;
}
