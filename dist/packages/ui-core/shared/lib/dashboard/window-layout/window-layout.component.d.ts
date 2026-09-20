import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, OnDestroy, OnInit, QueryList, TemplateRef } from '@angular/core';
import { GuiDrag, LayoutWithDraggableObject } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export declare class WindowLayoutComponent extends LayoutWithDraggableObject implements OnInit, AfterViewInit, OnDestroy {
    private readonly windowService;
    private readonly cdr;
    listWindows: QueryList<GuiDrag>;
    set windows(value: TemplateRef<any>[]);
    get windows(): TemplateRef<any>[];
    ngOnInit(): void;
    ngAfterViewInit(): void;
    protected drop(event: CdkDragDrop<number, number, any>): void;
    /**
     * Subscribe to list windows changes
     */
    private listWidgets;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowLayoutComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WindowLayoutComponent, "ga-window-layout", never, { "windows": { "alias": "windows"; "required": false; }; }, {}, never, never, false, never>;
}
