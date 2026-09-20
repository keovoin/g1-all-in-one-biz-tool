import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NbButtonModule, NbProgressBarModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { progressStatus } from '@gauzy/ui-core/common';
import { DurationFormatPipe } from '@gauzy/ui-core/shared';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import { TimeTrackWidgetStateComponent } from './time-track-widget-state.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
/**
 * List widget: the tasks that absorbed the most time in the selected range.
 *
 * Wraps the legacy dashboard's "Tasks" window: same top-N rows (title, share of
 * the range, duration) and the same jump into the Tasks dashboard.
 */
export class TasksListWidgetComponent extends BaseTimeTrackListWidgetComponent {
    constructor() {
        super(...arguments);
        this._router = inject(Router);
        /** @inheritdoc */
        this.emptyMessageBaseKey = 'TIMESHEET.NO_TASK_ACTIVITY';
    }
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
    fetch(context) {
        return this.statisticsCache.getTasks(context);
    }
    /**
     * Rounded share of the range's tracked time that went into a task.
     *
     * Rounded here rather than through the decimal pipe so the widget does not
     * pull `CommonModule` in for one number.
     *
     * @param task - The row being rendered.
     * @returns A percentage between 0 and 100.
     */
    sharePercentage(task) {
        return Math.round(task?.durationPercentage ?? 0);
    }
    /**
     * Nebular status for a percentage, so the bars use the same
     * danger/warning/info/success scale as the rest of the app.
     *
     * @param value - A percentage between 0 and 100.
     * @returns The matching Nebular status name.
     */
    statusFor(value) {
        return progressStatus(value ?? 0);
    }
    /** Opens the Tasks dashboard, matching the legacy panel's "View all". */
    openTasks() {
        this._router.navigate(['/pages/tasks/dashboard']);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksListWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TasksListWidgetComponent, isStandalone: true, selector: "gz-tasks-list-widget", usesInheritance: true, ngImport: i0, template: "<gz-time-track-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t[empty]=\"isEmpty()\"\n\t[emptyMessageKey]=\"emptyMessageKey()\"\n\t[skeletonRows]=\"5\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"list-panel\">\n\t\t<div class=\"list-actions\">\n\t\t\t<button nbButton ghost size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"openTasks()\">\n\t\t\t\t{{ 'BUTTONS.VIEW_ALL' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"list-scroll\">\n\t\t\t@for (task of rows(); track task.id) {\n\t\t\t\t<div class=\"list-row progress-row\">\n\t\t\t\t\t<span class=\"cell-text\" [title]=\"task?.title\">{{ task?.title }}</span>\n\n\t\t\t\t\t<div class=\"cell-progress\">\n\t\t\t\t\t\t<span class=\"progress-value\">{{ sharePercentage(task) }}%</span>\n\t\t\t\t\t\t<nb-progress-bar\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t[displayValue]=\"false\"\n\t\t\t\t\t\t\t[status]=\"statusFor(sharePercentage(task))\"\n\t\t\t\t\t\t\t[value]=\"sharePercentage(task)\"\n\t\t\t\t\t\t></nb-progress-bar>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<span class=\"cell-numeric cell-muted\">{{ task?.duration || 0 | durationFormat }}</span>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</gz-time-track-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:time-track-list-widget}.list-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0;font-size:12px;line-height:15px}.list-actions{display:flex;justify-content:flex-end;flex:0 0 auto}.list-actions button{font-size:12px;line-height:15px}.list-scroll{display:flex;flex-direction:column;gap:0;flex:1 1 auto;min-height:0;overflow-y:auto}.list-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-3);color:var(--text-hint-color);font-size:12px;line-height:15px;font-weight:var(--text-subtitle-2-font-weight);gap:.5rem;padding:var(--gauzy-table-header-padding-y) var(--gauzy-table-header-padding-x);border-radius:var(--gauzy-radius-sm);margin-bottom:2px}.list-row{align-items:center;gap:.5rem;padding:.875rem var(--gauzy-table-cell-padding-x);color:var(--gauzy-text-color-1);border-bottom:1px solid var(--gauzy-border-default-color);font-size:12px;line-height:15px;transition:background-color .15s ease-in-out}.list-row:last-child{border-bottom:none}.list-row:hover{background-color:var(--gauzy-hover-tint)}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-muted{color:var(--text-hint-color);font-size:12px;line-height:15px}.cell-numeric{white-space:nowrap;text-align:right}.cell-center{text-align:center}.cell-progress{display:flex;align-items:center;gap:.5rem;min-width:0}.cell-progress .progress-value{flex:0 0 auto;color:var(--text-hint-color);font-size:12px;line-height:15px;white-space:nowrap}.cell-progress nb-progress-bar{flex:1 1 auto;min-width:0}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:5px}.manual-time-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1.2fr) auto auto}.progress-row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) auto}.member-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.2fr)}.member-metric{display:flex;flex-direction:column;align-items:center;gap:.125rem;min-width:0}.member-metric .metric-duration{font-size:12px;line-height:15px;white-space:nowrap}.member-metric nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.member-week{display:flex;align-items:center;justify-content:center;gap:.5rem;min-width:0}.member-week-graph{display:flex;align-items:flex-end;gap:2px;height:28px;flex:0 0 auto}.member-week-graph .bar-graph-entry{width:4px;min-height:2px;border-radius:1px;background-color:var(--color-primary-default)}.activity-row{display:block;padding:.875rem var(--gauzy-table-cell-padding-x)}:host ::ng-deep ngx-activity-item .child,:host ::ng-deep ngx-activity-item .no-child{font-size:12px;line-height:15px}:host ::ng-deep ngx-activity-item .times,:host ::ng-deep ngx-activity-item .percentage-col,:host ::ng-deep ngx-activity-item .duration{font-size:12px;line-height:15px}@container time-track-list-widget (max-width: 420px){.manual-time-row{grid-template-columns:minmax(0,1.4fr) auto auto}.manual-time-date{display:none}.progress-row{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.member-week-graph{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbProgressBarModule }, { kind: "component", type: i1.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "component", type: TimeTrackWidgetStateComponent, selector: "gz-time-track-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }, { kind: "pipe", type: DurationFormatPipe, name: "durationFormat" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksListWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-tasks-list-widget', standalone: true, imports: [NbButtonModule, NbProgressBarModule, TranslateModule, DurationFormatPipe, TimeTrackWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t[empty]=\"isEmpty()\"\n\t[emptyMessageKey]=\"emptyMessageKey()\"\n\t[skeletonRows]=\"5\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"list-panel\">\n\t\t<div class=\"list-actions\">\n\t\t\t<button nbButton ghost size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"openTasks()\">\n\t\t\t\t{{ 'BUTTONS.VIEW_ALL' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"list-scroll\">\n\t\t\t@for (task of rows(); track task.id) {\n\t\t\t\t<div class=\"list-row progress-row\">\n\t\t\t\t\t<span class=\"cell-text\" [title]=\"task?.title\">{{ task?.title }}</span>\n\n\t\t\t\t\t<div class=\"cell-progress\">\n\t\t\t\t\t\t<span class=\"progress-value\">{{ sharePercentage(task) }}%</span>\n\t\t\t\t\t\t<nb-progress-bar\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t[displayValue]=\"false\"\n\t\t\t\t\t\t\t[status]=\"statusFor(sharePercentage(task))\"\n\t\t\t\t\t\t\t[value]=\"sharePercentage(task)\"\n\t\t\t\t\t\t></nb-progress-bar>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<span class=\"cell-numeric cell-muted\">{{ task?.duration || 0 | durationFormat }}</span>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</gz-time-track-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:time-track-list-widget}.list-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0;font-size:12px;line-height:15px}.list-actions{display:flex;justify-content:flex-end;flex:0 0 auto}.list-actions button{font-size:12px;line-height:15px}.list-scroll{display:flex;flex-direction:column;gap:0;flex:1 1 auto;min-height:0;overflow-y:auto}.list-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-3);color:var(--text-hint-color);font-size:12px;line-height:15px;font-weight:var(--text-subtitle-2-font-weight);gap:.5rem;padding:var(--gauzy-table-header-padding-y) var(--gauzy-table-header-padding-x);border-radius:var(--gauzy-radius-sm);margin-bottom:2px}.list-row{align-items:center;gap:.5rem;padding:.875rem var(--gauzy-table-cell-padding-x);color:var(--gauzy-text-color-1);border-bottom:1px solid var(--gauzy-border-default-color);font-size:12px;line-height:15px;transition:background-color .15s ease-in-out}.list-row:last-child{border-bottom:none}.list-row:hover{background-color:var(--gauzy-hover-tint)}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-muted{color:var(--text-hint-color);font-size:12px;line-height:15px}.cell-numeric{white-space:nowrap;text-align:right}.cell-center{text-align:center}.cell-progress{display:flex;align-items:center;gap:.5rem;min-width:0}.cell-progress .progress-value{flex:0 0 auto;color:var(--text-hint-color);font-size:12px;line-height:15px;white-space:nowrap}.cell-progress nb-progress-bar{flex:1 1 auto;min-width:0}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:5px}.manual-time-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1.2fr) auto auto}.progress-row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) auto}.member-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.2fr)}.member-metric{display:flex;flex-direction:column;align-items:center;gap:.125rem;min-width:0}.member-metric .metric-duration{font-size:12px;line-height:15px;white-space:nowrap}.member-metric nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.member-week{display:flex;align-items:center;justify-content:center;gap:.5rem;min-width:0}.member-week-graph{display:flex;align-items:flex-end;gap:2px;height:28px;flex:0 0 auto}.member-week-graph .bar-graph-entry{width:4px;min-height:2px;border-radius:1px;background-color:var(--color-primary-default)}.activity-row{display:block;padding:.875rem var(--gauzy-table-cell-padding-x)}:host ::ng-deep ngx-activity-item .child,:host ::ng-deep ngx-activity-item .no-child{font-size:12px;line-height:15px}:host ::ng-deep ngx-activity-item .times,:host ::ng-deep ngx-activity-item .percentage-col,:host ::ng-deep ngx-activity-item .duration{font-size:12px;line-height:15px}@container time-track-list-widget (max-width: 420px){.manual-time-row{grid-template-columns:minmax(0,1.4fr) auto auto}.manual-time-date{display:none}.progress-row{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.member-week-graph{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=tasks-list-widget.component.js.map