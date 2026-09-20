import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExpenseCategoriesService } from './expense-categories.service';
import * as i0 from "@angular/core";
import * as i1 from "./expense-categories.service";
export class ExpenseCategoriesStoreService {
    get expenseCategories() {
        return this._expenseCategories$.getValue();
    }
    constructor(expenseCategoriesService) {
        this.expenseCategoriesService = expenseCategoriesService;
        this._expenseCategories$ = new BehaviorSubject([]);
        this.expenseCategories$ = this._expenseCategories$.asObservable();
    }
    loadAll(where) {
        this.expenseCategoriesService
            .getAll(where)
            .pipe(tap(({ items }) => this._expenseCategories$.next(items)))
            .subscribe();
    }
    create(category) {
        return this.expenseCategoriesService
            .create(category)
            .pipe(tap((category) => this._expenseCategories$.next([
            ...this.expenseCategories,
            category
        ])));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpenseCategoriesStoreService, deps: [{ token: i1.ExpenseCategoriesService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpenseCategoriesStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpenseCategoriesStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.ExpenseCategoriesService }] });
//# sourceMappingURL=expense-categories-store.service.js.map