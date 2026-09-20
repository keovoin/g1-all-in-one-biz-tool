import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, defer, EMPTY, filter, from, of, repeat, Subject, switchMap, tap } from 'rxjs';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, TimeTrackerService } from '@gauzy/ui-core/core';
import { TimerIconFactory } from './factory';
import { TimerSynced } from './concretes';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
let TimeTrackerStatusService = class TimeTrackerStatusService {
    constructor(_timeTrackerService, _store) {
        this._timeTrackerService = _timeTrackerService;
        this._store = _store;
        this._icon$ = new BehaviorSubject(null);
        this._external$ = new Subject();
        this._userUpdate$ = new Subject();
        defer(() => of(!!this._store.token && !!this._store.user?.employee).pipe(switchMap((isEmployeeLoggedIn) => isEmployeeLoggedIn
            ? from(this.status()).pipe(catchError(() => EMPTY), untilDestroyed(this))
            : EMPTY), untilDestroyed(this)))
            .pipe(tap((status) => {
            const remoteTimer = new TimerSynced({
                ...status.lastLog,
                duration: status.duration
            });
            this._icon$.next(TimerIconFactory.create(remoteTimer.source));
            if (!remoteTimer.running || !remoteTimer.isExternalSource)
                this._icon$.next(null);
            this._external$.next(remoteTimer);
        }), repeat({
            delay: () => this._timeTrackerService.timer$
        }), untilDestroyed(this))
            .subscribe();
        this.external$
            .pipe(distinctUntilChange(), tap((synced) => {
            this._timeTrackerService.timerSynced = synced;
            this._userUpdate$.next(synced.lastLog.employee);
        }), untilDestroyed(this))
            .subscribe();
        this._userUpdate$
            .pipe(distinctUntilChange(), filter((employee) => !!employee), tap((employee) => {
            this._store.user = {
                ...this._store.user,
                employee
            };
        }), untilDestroyed(this))
            .subscribe();
    }
    get icon$() {
        return this._icon$.asObservable();
    }
    get external$() {
        return this._external$.asObservable();
    }
    status() {
        const { tenantId, organizationId } = this._timeTrackerService.timerConfig;
        return this._timeTrackerService.getTimerStatus({
            tenantId,
            organizationId,
            relations: ['employee']
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusService, deps: [{ token: i1.TimeTrackerService }, { token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusService, providedIn: 'root' }); }
};
TimeTrackerStatusService = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TimeTrackerService, Store])
], TimeTrackerStatusService);
export { TimeTrackerStatusService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.TimeTrackerService }, { type: i1.Store }] });
//# sourceMappingURL=time-tracker-status.service.js.map