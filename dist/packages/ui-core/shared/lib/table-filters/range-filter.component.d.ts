import { OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
export declare class RangeFilterComponent extends DefaultFilter implements OnInit, OnDestroy {
    rangeControl: FormGroup<{
        min: FormControl<any>;
        max: FormControl<any>;
    }>;
    private subscription;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RangeFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RangeFilterComponent, "ga-range-filter-selector", never, {}, {}, never, never, false, never>;
}
