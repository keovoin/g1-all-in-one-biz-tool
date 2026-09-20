import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NbBadgeModule, NbProgressBarModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { progressStatus } from '@gauzy/ui-core/common';
import { ComponentsModule } from '../../../components/components.module';
import { DurationFormatPipe } from '../../../pipes/duration-format.pipe';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamsWidgetStateComponent } from './teams-widget-state.component';
import { NO_TASK_ID } from './teams-dashboard.types';
import { toPercentage } from './teams-widget.utils';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../../components/avatar/avatar.component";
import * as i3 from "@ngx-translate/core";
/**
 * The drill-down table of the legacy Teams dashboard: every member with the
 * tasks they logged time against, each task's duration measured against its
 * estimate, and the member's activity percentage.
 *
 * On the legacy page this only appeared after clicking into a single team
 * (`gauzy-team-member` in its NON-classic mode, behind the team card's arrow
 * button). A canvas has no such navigation, so the widget renders every team in
 * scope at once and labels each member with their team; pinning it to one team
 * is what the placement's team scope is for.
 *
 * The compact widgets read the same snapshot — this one is the only consumer of
 * its `tasks`, which `TeamsDashboardStatisticsService` derives with the legacy
 * page's own `_groupBy('taskId')` pass.
 */
export class TeamMemberDetailsWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super(...arguments);
        /**
         * Every member row across the teams in scope, GROUPED BY TEAM.
         *
         * The grouping is the point, not an accident of `flatMap`: the legacy page
         * rendered one team at a time (`TeamComponent.members` concatenates the
         * selected team's `membersWorkingToday` with its `membersNotWorkingToday`), so
         * rendering several teams at once has to keep each team's block contiguous —
         * the rows carry a team name column exactly when there is more than one.
         * `TeamsDashboardStatisticsService` already emits `team.members` as
         * working-then-idle, which reproduces the legacy order INSIDE each block.
         *
         * Sorting the flattened list by working-state instead would interleave teams
         * and make the team column jump, which no view of this data ever did.
         */
        this.members = computed(() => (this.snapshot()?.teams ?? []).flatMap((team) => team.members), ...(ngDevMode ? [{ debugName: "members" }] : []));
        /** True when more than one team is in scope, which is when a row needs its team name. */
        this.showTeamName = computed(() => (this.snapshot()?.teams ?? []).length > 1, ...(ngDevMode ? [{ debugName: "showTeamName" }] : []));
    }
    /**
     * Whether a task row is the "time logged without a task" bucket.
     *
     * @param task - The task row being rendered.
     * @returns True when the row should be labelled rather than named.
     */
    isWithoutTask(task) {
        return task.id === NO_TASK_ID || !task.title;
    }
    /**
     * How far a task's logged time has eaten into its estimate.
     *
     * A task without an estimate yields 0 — the legacy page's `calculatePercentage`
     * divided by `undefined` and rendered the resulting `NaN` as an empty bar,
     * which is the same thing with a lot more console noise.
     *
     * @param task - The task row being rendered.
     * @returns A percentage between 0 and 100.
     */
    estimatePercentage(task) {
        return toPercentage(task.duration, task.estimate ?? 0);
    }
    /**
     * Nebular status for a percentage, so every bar and badge uses the same
     * danger/warning/info/success scale as the rest of the app.
     *
     * Accepts `null` because a member's activity legitimately has none.
     *
     * @param value - A percentage between 0 and 100, or `null`.
     * @returns The matching Nebular status name.
     */
    statusFor(value) {
        return progressStatus(value ?? 0);
    }
    /**
     * Rounded activity percentage rendered inside the member's badge.
     *
     * @param member - The member row being rendered.
     * @returns The percentage, e.g. `"64%"`.
     */
    activityLabel(member) {
        return `${Math.round(member.activity ?? 0)}%`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamMemberDetailsWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamMemberDetailsWidgetComponent, isStandalone: true, selector: "ga-team-member-details-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"members().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_MEMBER_DETAILS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"details-scroll\">\n\t\t<!-- Column captions of the legacy drill-down table, kept in view while scrolling. -->\n\t\t<div class=\"details-grid details-head\">\n\t\t\t<span class=\"cell-text\">{{ 'ORGANIZATIONS_PAGE.NAME' | translate }}</span>\n\n\t\t\t<div class=\"task-grid\">\n\t\t\t\t<span class=\"cell-text\">{{ 'MENU.IMPORT_EXPORT.TASK' | translate }}</span>\n\t\t\t\t<span class=\"cell-numeric\">{{ 'TIMESHEET.DURATION' | translate }}</span>\n\t\t\t\t<span class=\"cell-text cell-progress\">{{ 'MENU.IMPORT_EXPORT.PROGRESS' | translate }}</span>\n\t\t\t\t<span class=\"cell-numeric cell-estimate\">{{ 'TASKS_PAGE.ESTIMATE' | translate }}</span>\n\t\t\t</div>\n\n\t\t\t<span class=\"cell-numeric\">{{ 'REPORT_PAGE.ACTIVITY' | translate }}</span>\n\t\t</div>\n\n\t\t@for (member of members(); track member.id) {\n\t\t\t<div class=\"details-grid details-row\">\n\t\t\t\t<div class=\"details-identity\">\n\t\t\t\t\t<span\n\t\t\t\t\t\tclass=\"member-dot\"\n\t\t\t\t\t\t[class.online]=\"member.isRunningTimer\"\n\t\t\t\t\t\t[class.offline]=\"!member.isWorkingToday\"\n\t\t\t\t\t\t[attr.aria-hidden]=\"true\"\n\t\t\t\t\t></span>\n\n\t\t\t\t\t<div class=\"details-identity-text\">\n\t\t\t\t\t\t<ngx-avatar\n\t\t\t\t\t\t\tclass=\"report-table\"\n\t\t\t\t\t\t\t[id]=\"member.employee?.id\"\n\t\t\t\t\t\t\t[name]=\"member.name\"\n\t\t\t\t\t\t\t[src]=\"member.imageUrl\"\n\t\t\t\t\t\t\t[employee]=\"member.employee\"\n\t\t\t\t\t\t></ngx-avatar>\n\t\t\t\t\t\t@if (showTeamName()) {\n\t\t\t\t\t\t\t<div class=\"details-team\" [title]=\"member.teamName\">{{ member.teamName }}</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"details-tasks\">\n\t\t\t\t\t@for (task of member.tasks; track task.id) {\n\t\t\t\t\t\t<div class=\"task-grid\">\n\t\t\t\t\t\t\t<span class=\"cell-text\" [title]=\"task.title\">\n\t\t\t\t\t\t\t\t@if (isWithoutTask(task)) {\n\t\t\t\t\t\t\t\t\t{{ 'REPORT_PAGE.NO_TASK' | translate }}\n\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t{{ task.title }}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\n\t\t\t\t\t\t\t<span class=\"cell-numeric cell-muted\">{{ task.duration | durationFormat }}</span>\n\n\t\t\t\t\t\t\t<div class=\"cell-progress\">\n\t\t\t\t\t\t\t\t<nb-progress-bar\n\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\t[displayValue]=\"false\"\n\t\t\t\t\t\t\t\t\t[status]=\"statusFor(estimatePercentage(task))\"\n\t\t\t\t\t\t\t\t\t[value]=\"estimatePercentage(task)\"\n\t\t\t\t\t\t\t\t></nb-progress-bar>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<span class=\"cell-numeric cell-muted cell-estimate\">\n\t\t\t\t\t\t\t\t@if (task.estimate) {\n\t\t\t\t\t\t\t\t\t{{ task.estimate | durationFormat }}\n\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t&#8212;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t} @empty {\n\t\t\t\t\t\t<div class=\"task-grid\">\n\t\t\t\t\t\t\t<span class=\"cell-text cell-muted\">{{ 'ORGANIZATIONS_PAGE.NOT_WORKED' | translate }}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"details-activity\">\n\t\t\t\t\t@if (member.isWorkingToday && member.activity !== null) {\n\t\t\t\t\t\t<nb-badge [status]=\"statusFor(member.activity)\" [text]=\"activityLabel(member)\"></nb-badge>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:team-member-details}.details-scroll{display:flex;flex-direction:column;gap:.25rem;height:100%;min-height:0;overflow-y:auto;padding-right:.25rem}.details-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.4fr) auto;align-items:start;gap:.5rem;padding:.5rem}.details-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-1);color:var(--text-hint-color);font-size:var(--text-caption-font-size);font-weight:var(--text-subtitle-2-font-weight);align-items:center}.details-row{border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.details-identity{display:grid;grid-template-columns:16px minmax(0,1fr);align-items:center;gap:.5rem;min-width:0}.details-identity-text{display:flex;flex-direction:column;gap:.125rem;min-width:0}.member-dot{width:12px;height:12px;border-radius:50%;background-color:var(--color-warning-default)}.member-dot.online{background-color:var(--color-success-default)}.member-dot.offline{background-color:var(--color-danger-default)}.details-team{color:var(--text-hint-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.details-tasks{display:flex;flex-direction:column;gap:.25rem;min-width:0}.task-grid{display:grid;grid-template-columns:minmax(0,1.6fr) auto minmax(0,1fr) auto;align-items:center;gap:.5rem;min-width:0}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-numeric{white-space:nowrap;text-align:right}.cell-muted{color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.cell-progress{min-width:0}.details-activity nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:10px}@container team-member-details (max-width: 560px){.task-grid{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.cell-estimate{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbBadgeModule }, { kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "ngmodule", type: NbProgressBarModule }, { kind: "component", type: i1.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: ComponentsModule }, { kind: "component", type: i2.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }, { kind: "pipe", type: DurationFormatPipe, name: "durationFormat" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamMemberDetailsWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-member-details-widget', standalone: true, imports: [
                        NbBadgeModule,
                        NbProgressBarModule,
                        TranslateModule,
                        ComponentsModule,
                        DurationFormatPipe,
                        TeamsWidgetStateComponent
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"members().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_MEMBER_DETAILS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"details-scroll\">\n\t\t<!-- Column captions of the legacy drill-down table, kept in view while scrolling. -->\n\t\t<div class=\"details-grid details-head\">\n\t\t\t<span class=\"cell-text\">{{ 'ORGANIZATIONS_PAGE.NAME' | translate }}</span>\n\n\t\t\t<div class=\"task-grid\">\n\t\t\t\t<span class=\"cell-text\">{{ 'MENU.IMPORT_EXPORT.TASK' | translate }}</span>\n\t\t\t\t<span class=\"cell-numeric\">{{ 'TIMESHEET.DURATION' | translate }}</span>\n\t\t\t\t<span class=\"cell-text cell-progress\">{{ 'MENU.IMPORT_EXPORT.PROGRESS' | translate }}</span>\n\t\t\t\t<span class=\"cell-numeric cell-estimate\">{{ 'TASKS_PAGE.ESTIMATE' | translate }}</span>\n\t\t\t</div>\n\n\t\t\t<span class=\"cell-numeric\">{{ 'REPORT_PAGE.ACTIVITY' | translate }}</span>\n\t\t</div>\n\n\t\t@for (member of members(); track member.id) {\n\t\t\t<div class=\"details-grid details-row\">\n\t\t\t\t<div class=\"details-identity\">\n\t\t\t\t\t<span\n\t\t\t\t\t\tclass=\"member-dot\"\n\t\t\t\t\t\t[class.online]=\"member.isRunningTimer\"\n\t\t\t\t\t\t[class.offline]=\"!member.isWorkingToday\"\n\t\t\t\t\t\t[attr.aria-hidden]=\"true\"\n\t\t\t\t\t></span>\n\n\t\t\t\t\t<div class=\"details-identity-text\">\n\t\t\t\t\t\t<ngx-avatar\n\t\t\t\t\t\t\tclass=\"report-table\"\n\t\t\t\t\t\t\t[id]=\"member.employee?.id\"\n\t\t\t\t\t\t\t[name]=\"member.name\"\n\t\t\t\t\t\t\t[src]=\"member.imageUrl\"\n\t\t\t\t\t\t\t[employee]=\"member.employee\"\n\t\t\t\t\t\t></ngx-avatar>\n\t\t\t\t\t\t@if (showTeamName()) {\n\t\t\t\t\t\t\t<div class=\"details-team\" [title]=\"member.teamName\">{{ member.teamName }}</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"details-tasks\">\n\t\t\t\t\t@for (task of member.tasks; track task.id) {\n\t\t\t\t\t\t<div class=\"task-grid\">\n\t\t\t\t\t\t\t<span class=\"cell-text\" [title]=\"task.title\">\n\t\t\t\t\t\t\t\t@if (isWithoutTask(task)) {\n\t\t\t\t\t\t\t\t\t{{ 'REPORT_PAGE.NO_TASK' | translate }}\n\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t{{ task.title }}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\n\t\t\t\t\t\t\t<span class=\"cell-numeric cell-muted\">{{ task.duration | durationFormat }}</span>\n\n\t\t\t\t\t\t\t<div class=\"cell-progress\">\n\t\t\t\t\t\t\t\t<nb-progress-bar\n\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\t[displayValue]=\"false\"\n\t\t\t\t\t\t\t\t\t[status]=\"statusFor(estimatePercentage(task))\"\n\t\t\t\t\t\t\t\t\t[value]=\"estimatePercentage(task)\"\n\t\t\t\t\t\t\t\t></nb-progress-bar>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<span class=\"cell-numeric cell-muted cell-estimate\">\n\t\t\t\t\t\t\t\t@if (task.estimate) {\n\t\t\t\t\t\t\t\t\t{{ task.estimate | durationFormat }}\n\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t&#8212;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t} @empty {\n\t\t\t\t\t\t<div class=\"task-grid\">\n\t\t\t\t\t\t\t<span class=\"cell-text cell-muted\">{{ 'ORGANIZATIONS_PAGE.NOT_WORKED' | translate }}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"details-activity\">\n\t\t\t\t\t@if (member.isWorkingToday && member.activity !== null) {\n\t\t\t\t\t\t<nb-badge [status]=\"statusFor(member.activity)\" [text]=\"activityLabel(member)\"></nb-badge>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t}\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:team-member-details}.details-scroll{display:flex;flex-direction:column;gap:.25rem;height:100%;min-height:0;overflow-y:auto;padding-right:.25rem}.details-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.4fr) auto;align-items:start;gap:.5rem;padding:.5rem}.details-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-1);color:var(--text-hint-color);font-size:var(--text-caption-font-size);font-weight:var(--text-subtitle-2-font-weight);align-items:center}.details-row{border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.details-identity{display:grid;grid-template-columns:16px minmax(0,1fr);align-items:center;gap:.5rem;min-width:0}.details-identity-text{display:flex;flex-direction:column;gap:.125rem;min-width:0}.member-dot{width:12px;height:12px;border-radius:50%;background-color:var(--color-warning-default)}.member-dot.online{background-color:var(--color-success-default)}.member-dot.offline{background-color:var(--color-danger-default)}.details-team{color:var(--text-hint-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.details-tasks{display:flex;flex-direction:column;gap:.25rem;min-width:0}.task-grid{display:grid;grid-template-columns:minmax(0,1.6fr) auto minmax(0,1fr) auto;align-items:center;gap:.5rem;min-width:0}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-numeric{white-space:nowrap;text-align:right}.cell-muted{color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.cell-progress{min-width:0}.details-activity nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:10px}@container team-member-details (max-width: 560px){.task-grid{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.cell-estimate{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=team-member-details-widget.component.js.map