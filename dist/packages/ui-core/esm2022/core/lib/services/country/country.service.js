import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
let CountryService = class CountryService {
    constructor(http) {
        this.http = http;
        this._countries$ = new BehaviorSubject([]);
        this.countries$ = this._countries$.asObservable();
        this.find$ = new Subject();
        this._loadCountries();
    }
    _loadCountries() {
        this.find$
            .pipe(filter((val) => val === true), tap(() => this.getAll()), untilDestroyed(this))
            .subscribe();
    }
    getAll() {
        const currencies$ = this._countries$.getValue();
        if (currencies$.length > 0) {
            return EMPTY;
        }
        return this.http
            .get(`${API_PREFIX}/country`)
            .pipe(map(({ items, total }) => {
            this._countries$.next(items);
            return { items, total };
        }), untilDestroyed(this))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryService, providedIn: 'root' }); }
};
CountryService = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [HttpClient])
], CountryService);
export { CountryService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=country.service.js.map