import { ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CustomViewComponent implements OnInit, OnDestroy {
    private resolver;
    renderComponent: any;
    value: any;
    rowData: any;
    customComponent: any;
    dynamicTarget: any;
    constructor(resolver: ComponentFactoryResolver);
    ngOnInit(): void;
    ngOnDestroy(): void;
    protected createCustomComponent(): void;
    protected patchInstance(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CustomViewComponent, "ga-custom-component", never, { "renderComponent": { "alias": "renderComponent"; "required": false; }; "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
