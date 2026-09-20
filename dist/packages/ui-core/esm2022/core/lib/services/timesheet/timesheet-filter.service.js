import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import * as i0 from "@angular/core";
export const ActivityLevel = {
    start: 0,
    end: 100
};
export function initialTimesheetFilterState() {
    return {
        activityLevel: ActivityLevel,
        source: [],
        logType: []
    };
}
let TimesheetFilterStore = class TimesheetFilterStore extends Store {
    constructor() {
        super(initialTimesheetFilterState());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterStore, providedIn: 'root' }); }
};
TimesheetFilterStore = __decorate([
    StoreConfig({ name: 'timesheet-filter', resettable: true }),
    __metadata("design:paramtypes", [])
], TimesheetFilterStore);
export { TimesheetFilterStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
export class TimesheetFilterQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterQuery, deps: [{ token: TimesheetFilterStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: TimesheetFilterStore }] });
export class TimesheetFilterService {
    constructor(timesheetFilterStore, timesheetFilterQuery) {
        this.timesheetFilterStore = timesheetFilterStore;
        this.timesheetFilterQuery = timesheetFilterQuery;
        this.filter$ = this.timesheetFilterQuery.select((state) => state);
    }
    get filter() {
        return this.timesheetFilterQuery.getValue();
    }
    set filter(value) {
        this.timesheetFilterStore.update(value);
    }
    clear() {
        const obj = initialTimesheetFilterState();
        this.timesheetFilterStore.update(obj);
        return obj;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterService, deps: [{ token: TimesheetFilterStore }, { token: TimesheetFilterQuery }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetFilterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: TimesheetFilterStore }, { type: TimesheetFilterQuery }] });
//# sourceMappingURL=timesheet-filter.service.js.map