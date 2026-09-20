import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TableComponentsModule } from '../../../table-components/table-components.module';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import { BaseProjectManagementWidgetComponent } from './base-project-management-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "../../../table-components/project/project.component";
/**
 * The Project Management dashboard's "Most Viewed Projects" panel.
 *
 * Renders the very same `ngx-project` row the panel uses, over the same
 * popularity ranking: projects ordered by how many of the fetched tasks belong
 * to them. Because the widget samples one page of tasks rather than scrolling
 * through all of them, the ranking is over that sample — the same thing the
 * legacy panel shows before the user scrolls.
 *
 * The panel's "View All" button is dropped: on a canvas the card is one of many
 * and a navigation control inside it competes with the host's own edit-mode
 * menu, while the projects page stays one sidebar click away.
 */
export class MostViewedProjectsWidgetComponent extends BaseProjectManagementWidgetComponent {
    constructor() {
        super(...arguments);
        /**
         * Rows handed to `ngx-project`, most-worked-on project first.
         *
         * The `{ project }` wrappers are built in a `computed` rather than as an
         * object literal in the template: a literal allocates a new reference on every
         * change-detection pass, which re-runs the row component's input mapping (and
         * churns the `@for` track identity) for a list that did not change.
         */
        this.rows = computed(() => (this.snapshot()?.projects ?? []).map((project) => ({ project })), ...(ngDevMode ? [{ debugName: "rows" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MostViewedProjectsWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: MostViewedProjectsWidgetComponent, isStandalone: true, selector: "ga-pm-most-viewed-projects-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"rows().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.MOST_VIEWED_PROJECTS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"pm-panel\">\n\t\t<div class=\"pm-list\">\n\t\t\t@for (row of rows(); track row.project.id) {\n\t\t\t\t<div class=\"pm-row project-row\">\n\t\t\t\t\t<ngx-project [rowData]=\"row\"></ngx-project>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</ga-teams-widget-state>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}.pm-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0}.pm-list{display:flex;flex-direction:column;gap:.5rem;flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.25rem}.pm-row{padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.pm-title{color:var(--text-basic-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-footer{flex:0 0 auto;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".project-row{min-width:0;overflow:hidden}\n"], dependencies: [{ kind: "ngmodule", type: TableComponentsModule }, { kind: "component", type: i1.ProjectComponent, selector: "ngx-project", inputs: ["value", "rowData"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MostViewedProjectsWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-pm-most-viewed-projects-widget', standalone: true, imports: [TableComponentsModule, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"rows().length === 0\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.MOST_VIEWED_PROJECTS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"pm-panel\">\n\t\t<div class=\"pm-list\">\n\t\t\t@for (row of rows(); track row.project.id) {\n\t\t\t\t<div class=\"pm-row project-row\">\n\t\t\t\t\t<ngx-project [rowData]=\"row\"></ngx-project>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</ga-teams-widget-state>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}.pm-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0}.pm-list{display:flex;flex-direction:column;gap:.5rem;flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.25rem}.pm-row{padding:.5rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.pm-title{color:var(--text-basic-color);font-size:var(--text-caption-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-footer{flex:0 0 auto;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".project-row{min-width:0;overflow:hidden}\n"] }]
        }] });
//# sourceMappingURL=most-viewed-projects-widget.component.js.map