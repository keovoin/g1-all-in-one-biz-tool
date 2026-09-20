import { ITask } from '@gauzy/contracts';
import { BaseProjectManagementWidgetComponent } from './base-project-management-widget.component';
import * as i0 from "@angular/core";
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
export declare class RecentlyAssignedWidgetComponent extends BaseProjectManagementWidgetComponent {
    /** Open tasks of the fetched page, in the legacy panel's order. */
    protected readonly assigned: import("@angular/core").Signal<ITask[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecentlyAssignedWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecentlyAssignedWidgetComponent, "ga-pm-recently-assigned-widget", never, {}, {}, never, never, true, never>;
}
