import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TaskStatusEnum } from '@gauzy/contracts';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import { BaseProjectManagementWidgetComponent } from './base-project-management-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
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
export class MyTasksWidgetComponent extends BaseProjectManagementWidgetComponent {
    constructor() {
        super(...arguments);
        /** The fetched page of tasks, in server order (due date ascending). */
        this.tasks = computed(() => this.snapshot()?.tasks ?? [], ...(ngDevMode ? [{ debugName: "tasks" }] : []));
        /** Total tasks matching the scope, of which {@link tasks} is a sample. */
        this.total = computed(() => this.snapshot()?.total ?? 0, ...(ngDevMode ? [{ debugName: "total" }] : []));
        /** True when the scope holds more tasks than the sampled page shows. */
        this.hasMore = computed(() => this.total() > this.tasks().length, ...(ngDevMode ? [{ debugName: "hasMore" }] : []));
    }
    /**
     * Whether a task is finished, i.e. whether its dot is filled in.
     *
     * @param task - The row being rendered.
     * @returns True when the task is completed.
     */
    isCompleted(task) {
        return task?.status === TaskStatusEnum.COMPLETED;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MyTasksWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: MyTasksWidgetComponent, isStandalone: true, selector: "ga-pm-my-tasks-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"tasks().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.MY_TASKS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"pm-panel\">\n\t\t<div class=\"pm-list\">\n\t\t\t@for (task of tasks(); track task.id) {\n\t\t\t\t<div class=\"pm-row task-row\">\n\t\t\t\t\t<span class=\"task-dot\" [class.checked]=\"isCompleted(task)\" [attr.aria-hidden]=\"true\"></span>\n\t\t\t\t\t<div class=\"task-body\">\n\t\t\t\t\t\t<div class=\"task-status\">{{ task.status }}</div>\n\t\t\t\t\t\t<div class=\"pm-title\" [title]=\"task.title\">{{ task.title }}</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\n\t\t@if (hasMore()) {\n\t\t\t<div class=\"pm-footer\">\n\t\t\t\t{{\n\t\t\t\t\t'DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.SHOWING'\n\t\t\t\t\t\t| translate: { shown: tasks().length, total: total() }\n\t\t\t\t}}\n\t\t\t</div>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}.pm-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0}.pm-list{display:flex;flex-direction:column;gap:.5rem;flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.25rem}.pm-row{padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.pm-title{color:var(--text-basic-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-footer{flex:0 0 auto;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".task-row{display:grid;grid-template-columns:12px minmax(0,1fr);align-items:start;gap:.5rem}.task-dot{width:12px;height:12px;margin-top:.2rem;border:1px solid var(--color-primary-default);border-radius:50%}.task-dot.checked{background-color:var(--color-primary-default)}.task-body{display:flex;flex-direction:column;gap:.125rem;min-width:0}.task-status{color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: TranslateModule }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MyTasksWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-pm-my-tasks-widget', standalone: true, imports: [TranslateModule, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"tasks().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.MY_TASKS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"pm-panel\">\n\t\t<div class=\"pm-list\">\n\t\t\t@for (task of tasks(); track task.id) {\n\t\t\t\t<div class=\"pm-row task-row\">\n\t\t\t\t\t<span class=\"task-dot\" [class.checked]=\"isCompleted(task)\" [attr.aria-hidden]=\"true\"></span>\n\t\t\t\t\t<div class=\"task-body\">\n\t\t\t\t\t\t<div class=\"task-status\">{{ task.status }}</div>\n\t\t\t\t\t\t<div class=\"pm-title\" [title]=\"task.title\">{{ task.title }}</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\n\t\t@if (hasMore()) {\n\t\t\t<div class=\"pm-footer\">\n\t\t\t\t{{\n\t\t\t\t\t'DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.SHOWING'\n\t\t\t\t\t\t| translate: { shown: tasks().length, total: total() }\n\t\t\t\t}}\n\t\t\t</div>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}.pm-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0}.pm-list{display:flex;flex-direction:column;gap:.5rem;flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.25rem}.pm-row{padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.pm-title{color:var(--text-basic-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-footer{flex:0 0 auto;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".task-row{display:grid;grid-template-columns:12px minmax(0,1fr);align-items:start;gap:.5rem}.task-dot{width:12px;height:12px;margin-top:.2rem;border:1px solid var(--color-primary-default);border-radius:50%}.task-dot.checked{background-color:var(--color-primary-default)}.task-body{display:flex;flex-direction:column;gap:.125rem;min-width:0}.task-status{color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=my-tasks-widget.component.js.map