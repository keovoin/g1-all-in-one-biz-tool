import { Query, Store } from '@datorama/akita';
import { ITimeLogFilters } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare const ActivityLevel: {
    start: number;
    end: number;
};
export declare function initialTimesheetFilterState(): ITimeLogFilters;
export declare class TimesheetFilterStore extends Store<ITimeLogFilters> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<TimesheetFilterStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimesheetFilterStore>;
}
export declare class TimesheetFilterQuery extends Query<ITimeLogFilters> {
    constructor(store: TimesheetFilterStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<TimesheetFilterQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimesheetFilterQuery>;
}
export declare class TimesheetFilterService {
    protected readonly timesheetFilterStore: TimesheetFilterStore;
    protected readonly timesheetFilterQuery: TimesheetFilterQuery;
    constructor(timesheetFilterStore: TimesheetFilterStore, timesheetFilterQuery: TimesheetFilterQuery);
    filter$: import("rxjs").Observable<ITimeLogFilters>;
    get filter(): ITimeLogFilters;
    set filter(value: ITimeLogFilters);
    clear(): ITimeLogFilters;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimesheetFilterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimesheetFilterService>;
}
