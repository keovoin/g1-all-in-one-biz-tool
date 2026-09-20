import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TableComponentsModule } from '../../../table-components/table-components.module';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import { BaseProjectManagementWidgetComponent } from './base-project-management-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "../../../table-components/tags-only/tags-only.component";
/**
 * The Project Management dashboard's "Recently Assigned" panel.
 *
 * Same rows as the panel — the open tasks of the fetched page with their tag
 * chips, rendered by the very same `ga-only-tags` cell component — and the same
 * order (see `openTasksMostRecentFirst`).
 *
 * One difference from the legacy page, which only renders this panel while an
 * employee is selected: a widget the user deliberately placed must not vanish
 * because a header selector was cleared. With no employee in scope it shows the
 * organization's open tasks, which is the same query one scope wider.
 */
export class RecentlyAssignedWidgetComponent extends BaseProjectManagementWidgetComponent {
    constructor() {
        super(...arguments);
        /** Open tasks of the fetched page, in the legacy panel's order. */
        this.assigned = computed(() => this.snapshot()?.assigned ?? [], ...(ngDevMode ? [{ debugName: "assigned" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecentlyAssignedWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RecentlyAssignedWidgetComponent, isStandalone: true, selector: "ga-pm-recently-assigned-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"assigned().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.RECENTLY_ASSIGNED.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"pm-panel\">\n\t\t<div class=\"pm-list\">\n\t\t\t@for (task of assigned(); track task.id) {\n\t\t\t\t<div class=\"pm-row assigned-row\">\n\t\t\t\t\t<div class=\"pm-title\" [title]=\"task.title\">{{ task.title }}</div>\n\t\t\t\t\t<ga-only-tags [rowData]=\"task\"></ga-only-tags>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</ga-teams-widget-state>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}.pm-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0}.pm-list{display:flex;flex-direction:column;gap:.5rem;flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.25rem}.pm-row{padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.pm-title{color:var(--text-basic-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-footer{flex:0 0 auto;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".assigned-row{display:flex;flex-direction:column;gap:.25rem;min-width:0;background-color:transparent;border:1px solid var(--border-basic-color-3)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: TableComponentsModule }, { kind: "component", type: i1.TagsOnlyComponent, selector: "ga-only-tags", inputs: ["value"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecentlyAssignedWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-pm-recently-assigned-widget', standalone: true, imports: [TableComponentsModule, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"assigned().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.RECENTLY_ASSIGNED.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"pm-panel\">\n\t\t<div class=\"pm-list\">\n\t\t\t@for (task of assigned(); track task.id) {\n\t\t\t\t<div class=\"pm-row assigned-row\">\n\t\t\t\t\t<div class=\"pm-title\" [title]=\"task.title\">{{ task.title }}</div>\n\t\t\t\t\t<ga-only-tags [rowData]=\"task\"></ga-only-tags>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</ga-teams-widget-state>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}.pm-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0}.pm-list{display:flex;flex-direction:column;gap:.5rem;flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.25rem}.pm-row{padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.pm-title{color:var(--text-basic-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-footer{flex:0 0 auto;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".assigned-row{display:flex;flex-direction:column;gap:.25rem;min-width:0;background-color:transparent;border:1px solid var(--border-basic-color-3)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=recently-assigned-widget.component.js.map