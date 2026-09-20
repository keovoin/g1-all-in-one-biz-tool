import { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
export declare class InputFilterComponent extends DefaultFilter implements OnInit, OnDestroy, OnChanges {
    inputControl: FormControl<any>;
    private subscription;
    constructor();
    ngOnInit(): void;
    /**
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Lifecycle hook called just before the component is destroyed.
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InputFilterComponent, "ga-input-filter-selector", never, {}, {}, never, never, false, never>;
}
