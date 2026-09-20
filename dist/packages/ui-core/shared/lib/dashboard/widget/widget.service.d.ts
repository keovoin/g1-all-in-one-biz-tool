import { OnDestroy } from '@angular/core';
import { GuiDrag } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export declare class WidgetService implements OnDestroy {
    private readonly store;
    private _widgetsRef;
    private _widgets;
    private _widgetLayoutPersistance;
    private _widgetsTakers;
    private _localStorage;
    private _widgets$;
    private _strategy;
    constructor();
    get widgetsRef(): any[];
    set widgetsRef(value: any[]);
    protected sorting(): void;
    protected sortingReverse(): void;
    get widgets(): GuiDrag[];
    set widgets(value: GuiDrag[]);
    save(): void;
    retrieve(): Partial<GuiDrag>[];
    undoDrag(): void;
    set widgets$(value: Partial<GuiDrag[]>);
    updateWidget(value: GuiDrag): void;
    hideWidget(position: number): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WidgetService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WidgetService>;
}
