import { ITask } from '@gauzy/contracts';
import { BaseProjectManagementWidgetComponent } from './base-project-management-widget.component';
import * as i0 from "@angular/core";
/**
 * The task list of the Project Management dashboard's "Today" panel.
 *
 * Same rows as the legacy panel: a completion dot, the raw task status and the
 * title, ordered by due date. Two aspects of the panel's behaviour are
 * deliberately NOT carried over:
 *
 * - the infinite scroll, because a canvas card samples one page instead (the
 *   widget says how many of the total it is showing rather than pretending the
 *   page is everything);
 * - the "Add Todo" button, because it opens `MyTaskDialogComponent`, which lives
 *   in the application's pages and cannot be imported from `@gauzy/ui-core`. A
 *   button that silently did nothing would be worse than no button.
 */
export declare class MyTasksWidgetComponent extends BaseProjectManagementWidgetComponent {
    /** The fetched page of tasks, in server order (due date ascending). */
    protected readonly tasks: import("@angular/core").Signal<ITask[]>;
    /** Total tasks matching the scope, of which {@link tasks} is a sample. */
    protected readonly total: import("@angular/core").Signal<number>;
    /** True when the scope holds more tasks than the sampled page shows. */
    protected readonly hasMore: import("@angular/core").Signal<boolean>;
    /**
     * Whether a task is finished, i.e. whether its dot is filled in.
     *
     * @param task - The row being rendered.
     * @returns True when the task is completed.
     */
    protected isCompleted(task: ITask): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyTasksWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyTasksWidgetComponent, "ga-pm-my-tasks-widget", never, {}, {}, never, never, true, never>;
}
