import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defer, from, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, retry, switchMap, tap } from 'rxjs/operators';
import { OrganizationProjectsService } from '@gauzy/ui-core/core';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import { TimeTrackCounterCardComponent } from './time-track-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many projects were worked on in the selected range,
 * scaled against the organization's total project count.
 */
export class ProjectsWorkedWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    constructor() {
        super(...arguments);
        this._projectsService = inject(OrganizationProjectsService);
        /** Total projects in the organization — the counter-point denominator. */
        this.totalProjects = signal(0, ...(ngDevMode ? [{ debugName: "totalProjects" }] : []));
        /** Projects that received logged time in the selected range. */
        this.projectsWorked = computed(() => this.counts()?.projectsCount ?? 0, ...(ngDevMode ? [{ debugName: "projectsWorked" }] : []));
    }
    /**
     * Starts the shared counts subscription and the organization project-count lookup.
     */
    ngOnInit() {
        super.ngOnInit();
        this.observeProjectsCount();
    }
    /**
     * Keeps the total project count in sync with the active organization.
     *
     * Wrapped in `defer` + `from` because `OrganizationProjectsService.getCount`
     * returns a Promise — `defer` re-invokes it on retry, where a bare `from`
     * would just replay the SAME settled promise. Failures only affect the
     * strip's scale, so they are swallowed.
     */
    observeProjectsCount() {
        this.context$
            .pipe(filter((context) => !!context?.organizationId), 
        // The project count depends on the organization ALONE, so a date-range
        // change must not re-issue it (see the Members Worked widget).
        distinctUntilChanged((previous, current) => previous.organizationId === current.organizationId && previous.tenantId === current.tenantId), switchMap((context) => defer(() => from(this._projectsService.getCount({
            organizationId: context.organizationId,
            tenantId: context.tenantId
        }))).pipe(retry({ count: 1, delay: 1_000 }), catchError(() => of(0)))), tap((count) => this.totalProjects.set(count || 0)), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectsWorkedWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProjectsWorkedWidgetComponent, isStandalone: true, selector: "gz-projects-worked-widget", usesInheritance: true, ngImport: i0, template: "<gz-time-track-counter-card\n\tcolor=\"success\"\n\t[value]=\"projectsWorked().toString()\"\n\t[counterValue]=\"projectsWorked()\"\n\t[total]=\"totalProjects()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n", dependencies: [{ kind: "component", type: TimeTrackCounterCardComponent, selector: "gz-time-track-counter-card", inputs: ["captionKey", "value", "counterValue", "total", "color", "progress", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectsWorkedWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-projects-worked-widget', standalone: true, imports: [TimeTrackCounterCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-counter-card\n\tcolor=\"success\"\n\t[value]=\"projectsWorked().toString()\"\n\t[counterValue]=\"projectsWorked()\"\n\t[total]=\"totalProjects()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n" }]
        }] });
//# sourceMappingURL=projects-worked-widget.component.js.map