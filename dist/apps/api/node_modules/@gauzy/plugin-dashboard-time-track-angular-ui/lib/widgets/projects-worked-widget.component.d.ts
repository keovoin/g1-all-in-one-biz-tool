import { OnInit } from '@angular/core';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many projects were worked on in the selected range,
 * scaled against the organization's total project count.
 */
export declare class ProjectsWorkedWidgetComponent extends BaseTimeTrackCounterWidgetComponent implements OnInit {
    private readonly _projectsService;
    /** Total projects in the organization — the counter-point denominator. */
    protected readonly totalProjects: import("@angular/core").WritableSignal<number>;
    /** Projects that received logged time in the selected range. */
    protected readonly projectsWorked: import("@angular/core").Signal<number>;
    /**
     * Starts the shared counts subscription and the organization project-count lookup.
     */
    ngOnInit(): void;
    /**
     * Keeps the total project count in sync with the active organization.
     *
     * Wrapped in `defer` + `from` because `OrganizationProjectsService.getCount`
     * returns a Promise — `defer` re-invokes it on retry, where a bare `from`
     * would just replay the SAME settled promise. Failures only affect the
     * strip's scale, so they are swallowed.
     */
    private observeProjectsCount;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectsWorkedWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectsWorkedWidgetComponent, "gz-projects-worked-widget", never, {}, {}, never, never, true, never>;
}
