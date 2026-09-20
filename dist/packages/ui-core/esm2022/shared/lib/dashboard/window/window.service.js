import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Store } from '@gauzy/ui-core/core';
import { LayoutPersistance } from '../concretes/contexts/layout-persistance.class';
import { PersistanceTakers } from '../concretes/contexts/persistance-takers.class';
import { LocalStorageStrategy } from '../concretes/strategies/local-storage-strategy.class';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
let WindowService = class WindowService {
    constructor(store) {
        this.store = store;
        this._windowsRef = [];
        this._windows = [];
        this._windowLayoutPersistance = new LayoutPersistance();
        this._localStorage = new LocalStorageStrategy();
        this._windowsTakers = new PersistanceTakers(this._windowLayoutPersistance);
        this._windows$ = new Subject();
        this._windows$
            .pipe(tap((windows) => (this.windows = windows)), tap(() => (this._windowLayoutPersistance.state = this.windows)), filter(() => this.windowsRef.length === 0), tap(() => {
            this.retrieve().length === 0
                ? this.save()
                : this.retrieve().forEach((deserialized) => this.windowsRef.push(deserialized.templateRef));
        }), untilDestroyed(this))
            .subscribe();
    }
    get windowsRef() {
        return this._windowsRef;
    }
    set windowsRef(value) {
        this._windowsRef = value;
        this.sorting();
    }
    sorting() {
        const buffers = [];
        this.windowsRef.forEach((windowsRef) => {
            this.windows.forEach((window) => {
                if (windowsRef === window.templateRef) {
                    buffers.push(window);
                }
            });
        });
        this.windows = buffers;
    }
    get windows() {
        return this._windows;
    }
    set windows(value) {
        this._windows = value;
    }
    save() {
        if (this.windows.length === 0)
            return;
        this._windowsTakers.backup();
        this._strategy = this._localStorage;
        this._strategy.serializables = this.windows;
        this.store.windows = this._strategy.serialize();
    }
    retrieve() {
        this._strategy = this._localStorage;
        this._strategy.serializables = this.windows;
        return this._strategy.deSerialize(this.store.windows);
    }
    undoDrag() {
        this._windowsTakers.undo();
        this.windows = this._windowLayoutPersistance.state;
        this.sortingReverse();
        this._strategy = this._localStorage;
        this._strategy.serializables = this.windows;
        this.store.windows = this._strategy.serialize();
    }
    sortingReverse() {
        const buffers = [];
        this.windows.forEach((windows) => {
            this.windowsRef.forEach((windowsRef) => {
                if (windowsRef === windows.templateRef) {
                    buffers.push(windowsRef);
                }
            });
        });
        this.windowsRef = buffers;
    }
    set windows$(value) {
        this._windows$.next(value);
    }
    updateWindow(value) {
        this.windows.forEach((window) => {
            if (window.templateRef === value.templateRef) {
                value.hide = window.hide;
                value.isCollapse = window.isCollapse;
                value.isExpand = window.isExpand;
            }
        });
    }
    hideWindow(position) {
        this.windows.forEach((widget) => {
            if (widget.position === position) {
                widget.hide = true;
            }
        });
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowService, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowService, providedIn: 'root' }); }
};
WindowService = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store])
], WindowService);
export { WindowService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Store }] });
//# sourceMappingURL=window.service.js.map