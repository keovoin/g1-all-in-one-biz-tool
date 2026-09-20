import { __decorate, __metadata } from "tslib";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
let RouteUtil = class RouteUtil {
    constructor(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataStore = { data: {} };
        this._data = new BehaviorSubject(this.dataStore.data);
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd), untilDestroyed(this))
            .subscribe(() => {
            this.updateData();
        });
        this.updateData();
    }
    get data() {
        return this.dataStore.data;
    }
    get data$() {
        return this._data.asObservable();
    }
    set data(value) {
        this.dataStore.data = value;
        this._data.next(Object.assign({}, this.dataStore).data);
    }
    updateData() {
        let data = {};
        let route = this.activatedRoute.snapshot;
        do {
            data = Object.assign(data, route.data);
            route = route.firstChild;
        } while (route);
        this.data = data;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RouteUtil, deps: [{ token: i1.Router }, { token: i1.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RouteUtil }); }
};
RouteUtil = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Router, ActivatedRoute])
], RouteUtil);
export { RouteUtil };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RouteUtil, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Router }, { type: i1.ActivatedRoute }] });
//# sourceMappingURL=route-utils.js.map