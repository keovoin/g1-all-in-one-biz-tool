import { AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { ISidebarConfig } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ThemeSidebarComponent implements AfterViewInit, OnDestroy {
    private componentFactoryResolver;
    private changeDetectorRef;
    config: ISidebarConfig;
    private container;
    private componentRef;
    constructor(componentFactoryResolver: ComponentFactoryResolver, changeDetectorRef: ChangeDetectorRef);
    ngAfterViewInit(): void;
    private loadComponent;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeSidebarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ThemeSidebarComponent, "ngx-theme-sidebar", never, { "config": { "alias": "config"; "required": false; }; }, {}, never, never, false, never>;
}
