import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, retry, switchMap, tap } from 'rxjs/operators';
import { EmployeesService } from '@gauzy/ui-core/core';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import { TimeTrackCounterCardComponent } from './time-track-counter-card.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many members logged time in the selected range.
 *
 * The counter-point strip compares that number against the organization's total
 * head count, so an "8" reads very differently in a team of 9 than in a team of 90.
 */
export class MembersWorkedWidgetComponent extends BaseTimeTrackCounterWidgetComponent {
    constructor() {
        super(...arguments);
        this._employeesService = inject(EmployeesService);
        /** Total members in the organization — the counter-point denominator. */
        this.totalEmployees = signal(0, ...(ngDevMode ? [{ debugName: "totalEmployees" }] : []));
        /** Members that logged time in the selected range. */
        this.membersWorked = computed(() => this.counts()?.employeesCount ?? 0, ...(ngDevMode ? [{ debugName: "membersWorked" }] : []));
    }
    /**
     * Starts the shared counts subscription and the organization head-count lookup.
     */
    ngOnInit() {
        super.ngOnInit();
        this.observeEmployeesCount();
    }
    /**
     * Keeps the total head count in sync with the active organization.
     *
     * A failure here only degrades the strip's scale, never the headline figure,
     * so it is swallowed instead of surfacing an error state on the whole widget.
     */
    observeEmployeesCount() {
        this.context$
            .pipe(filter((context) => !!context?.organizationId), 
        // The head count depends on the organization ALONE. Without this,
        // every date-range tweak would fire another `/employee/count` per
        // widget on the canvas, for an answer that cannot have changed.
        distinctUntilChanged((previous, current) => previous.organizationId === current.organizationId && previous.tenantId === current.tenantId), switchMap((context) => this._employeesService
            .getCount({ organizationId: context.organizationId, tenantId: context.tenantId })
            // One retry before giving up: because the request is now
            // deduplicated per organization, a transient failure would
            // otherwise pin the denominator to 0 until the user switches
            // organizations.
            .pipe(retry({ count: 1, delay: 1_000 }), catchError(() => of(0)))), tap((count) => this.totalEmployees.set(count || 0)), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MembersWorkedWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: MembersWorkedWidgetComponent, isStandalone: true, selector: "gz-members-worked-widget", providers: [EmployeesService], usesInheritance: true, ngImport: i0, template: "<gz-time-track-counter-card\n\tcolor=\"info\"\n\t[value]=\"membersWorked().toString()\"\n\t[counterValue]=\"membersWorked()\"\n\t[total]=\"totalEmployees()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n", dependencies: [{ kind: "component", type: TimeTrackCounterCardComponent, selector: "gz-time-track-counter-card", inputs: ["captionKey", "value", "counterValue", "total", "color", "progress", "loading", "error"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MembersWorkedWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-members-worked-widget', standalone: true, imports: [TimeTrackCounterCardComponent], providers: [EmployeesService], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-counter-card\n\tcolor=\"info\"\n\t[value]=\"membersWorked().toString()\"\n\t[counterValue]=\"membersWorked()\"\n\t[total]=\"totalEmployees()\"\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t(retry)=\"refresh()\"\n></gz-time-track-counter-card>\n" }]
        }] });
//# sourceMappingURL=members-worked-widget.component.js.map