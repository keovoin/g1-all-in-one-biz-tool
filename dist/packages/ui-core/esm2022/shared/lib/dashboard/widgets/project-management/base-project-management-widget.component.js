import { Directive, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import { ProjectManagementTasksService } from './project-management-tasks.service';
import { projectManagementScopeKey } from './project-management-widget.utils';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every data-driven Project Management widget.
 *
 * The Today, Most Viewed Projects and Recently Assigned panels are three
 * projections of the very same task page, so they all subscribe to the ambient
 * dashboard context here and fetch through {@link ProjectManagementTasksService}.
 * That service collapses the identical in-flight requests into one, which is
 * what makes it cheap to drop all three on the same canvas.
 *
 * Subclasses only decide WHICH part of the snapshot they render; they never
 * fetch. The Inbox widget does not extend this class — it has no data source.
 */
export class BaseProjectManagementWidgetComponent extends BaseDashboardWidgetComponent {
    constructor() {
        super(...arguments);
        this._tasks = inject(ProjectManagementTasksService);
        /** Manual re-fetch trigger, fed by {@link refresh}. */
        this._reload$ = new Subject();
        /** Latest snapshot; `null` until the first successful fetch. */
        this.snapshot = signal(null, ...(ngDevMode ? [{ debugName: "snapshot" }] : []));
        /** Context the current snapshot was fetched for. */
        this.widgetContext = signal(null, ...(ngDevMode ? [{ debugName: "widgetContext" }] : []));
    }
    /**
     * Starts the snapshot subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same page twice. This class
     * subscribes to `context$` itself instead.
     *
     * Subclasses that need extra data must override this and call `super.ngOnInit()`.
     */
    ngOnInit() {
        // Show the skeleton from the very first paint: the canvas may take a moment
        // to resolve an organization, and an immediate "no tasks" empty state would
        // read as a real (and wrong) answer.
        this.loading.set(true);
        this.observeSnapshot();
    }
    /**
     * Re-fetches the task page, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh() {
        this.clearError();
        // Without dropping the cached snapshot a manual refresh inside the cache TTL
        // would silently replay the stale rows. `invalidate()` coalesces per scope,
        // so all three widgets refreshing at once still cause one request.
        const context = this.widgetContext();
        if (context) {
            this._tasks.invalidate(context);
        }
        this._reload$.next();
    }
    /**
     * Wires `context$` (plus manual reloads) to the task service and mirrors the
     * request lifecycle into the `loading` / `error` signals.
     */
    observeSnapshot() {
        combineLatest([
            // Compare on the scope key only. Two reasons: an unrelated store write
            // hands out a new `organization` object on every emission, and the date
            // range picker emits fresh `Date`s constantly — neither can change a task
            // page that is scoped by organization/employee/project alone.
            this.context$.pipe(distinctUntilChanged((previous, current) => projectManagementScopeKey(previous) === projectManagementScopeKey(current))),
            this._reload$.pipe(startWith(undefined))
        ])
            .pipe(map(([context]) => context), 
        // A context without an organization cannot produce a meaningful
        // request; the canvas shows the "select an organization" state.
        filter((context) => !!context?.organizationId), tap((context) => {
            this.widgetContext.set(context);
            this.loading.set(true);
            this.clearError();
        }), 
        // switchMap, not mergeMap: a fast scope change must abandon the
        // previous request instead of racing it to the signal.
        switchMap((context) => this._tasks.getSnapshot(context).pipe(catchError((error) => {
            this.setError(error);
            return of(null);
        }))), tap((snapshot) => {
            // Keep the last good snapshot on screen when a refresh fails, rather
            // than blanking a working widget.
            if (snapshot) {
                this.snapshot.set(snapshot);
            }
            this.loading.set(false);
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseProjectManagementWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: BaseProjectManagementWidgetComponent, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseProjectManagementWidgetComponent, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=base-project-management-widget.component.js.map