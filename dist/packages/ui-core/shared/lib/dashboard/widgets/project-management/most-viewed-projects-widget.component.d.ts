import { IOrganizationProject } from '@gauzy/contracts';
import { BaseProjectManagementWidgetComponent } from './base-project-management-widget.component';
import * as i0 from "@angular/core";
/** The smart-table style row object `ngx-project` reads its project out of. */
interface IProjectRow {
    readonly project: IOrganizationProject;
}
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
export declare class MostViewedProjectsWidgetComponent extends BaseProjectManagementWidgetComponent {
    /**
     * Rows handed to `ngx-project`, most-worked-on project first.
     *
     * The `{ project }` wrappers are built in a `computed` rather than as an
     * object literal in the template: a literal allocates a new reference on every
     * change-detection pass, which re-runs the row component's input mapping (and
     * churns the `@for` track identity) for a list that did not change.
     */
    protected readonly rows: import("@angular/core").Signal<IProjectRow[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MostViewedProjectsWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MostViewedProjectsWidgetComponent, "ga-pm-most-viewed-projects-widget", never, {}, {}, never, never, true, never>;
}
export {};
