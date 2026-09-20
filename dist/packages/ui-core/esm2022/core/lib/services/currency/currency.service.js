import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
let CurrencyService = class CurrencyService {
    constructor(http) {
        this.http = http;
        this._currencies$ = new BehaviorSubject([]);
        this.currencies$ = this._currencies$.asObservable();
        this.find$ = new Subject();
        this._loadCurrencies();
    }
    _loadCurrencies() {
        this.find$
            .pipe(filter((val) => val === true), tap(() => this.getAll()), untilDestroyed(this))
            .subscribe();
    }
    getAll() {
        const currencies$ = this._currencies$.getValue();
        if (currencies$.length > 0) {
            return EMPTY;
        }
        return this.http
            .get(`${API_PREFIX}/currency`)
            .pipe(map(({ items, total }) => {
            this._currencies$.next(items);
            return { items, total };
        }), untilDestroyed(this))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CurrencyService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CurrencyService, providedIn: 'root' }); }
};
CurrencyService = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [HttpClient])
], CurrencyService);
export { CurrencyService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CurrencyService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=currency.service.js.map