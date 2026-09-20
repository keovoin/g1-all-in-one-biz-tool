import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewChecked, AfterViewInit, OnDestroy, OnInit, QueryList, TemplateRef } from '@angular/core';
import { GuiDrag, LayoutWithDraggableObject } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export declare class WidgetLayoutComponent extends LayoutWithDraggableObject implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    private readonly widgetService;
    private readonly cdr;
    set widgets(value: TemplateRef<any>[]);
    listWidgets: QueryList<GuiDrag>;
    ngAfterViewChecked(): void;
    ngAfterViewInit(): void;
    protected drop(event: CdkDragDrop<number>): void;
    ngOnInit(): void;
    get widgets(): TemplateRef<any>[];
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WidgetLayoutComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WidgetLayoutComponent, "ga-widget-layout", never, { "widgets": { "alias": "widgets"; "required": false; }; }, {}, never, never, false, never>;
}
