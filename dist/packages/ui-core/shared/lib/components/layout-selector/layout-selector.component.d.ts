import { OnInit } from '@angular/core';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import { ComponentEnum } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class LayoutSelectorComponent implements OnInit {
    protected readonly store: Store;
    protected readonly layoutStyles: typeof ComponentLayoutStyleEnum;
    protected readonly componentName: import("@angular/core").InputSignal<ComponentEnum>;
    readonly componentLayoutStyle: import("@angular/core").WritableSignal<ComponentLayoutStyleEnum>;
    ngOnInit(): void;
    protected changeLayout(layout: ComponentLayoutStyleEnum): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayoutSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LayoutSelectorComponent, "ga-layout-selector", never, { "componentName": { "alias": "componentName"; "required": false; "isSignal": true; }; }, {}, never, never, false, never>;
}
