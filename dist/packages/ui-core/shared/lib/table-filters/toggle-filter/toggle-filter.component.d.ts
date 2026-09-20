import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
export declare class ToggleFilterComponent extends DefaultFilter implements OnChanges {
    faCheck: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faBan: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faTimes: import("@fortawesome/fontawesome-common-types").IconDefinition;
    choice: any;
    constructor();
    private _isChecked;
    get isChecked(): boolean;
    set isChecked(value: boolean);
    onChange(): void;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToggleFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ToggleFilterComponent, "ga-toggle-filter", never, {}, {}, never, never, false, never>;
}
