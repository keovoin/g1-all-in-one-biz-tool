import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GuiDrag } from '@gauzy/ui-core/common';
import { WidgetService } from './widget.service';
import * as i0 from "@angular/core";
export declare class WidgetComponent extends GuiDrag implements OnInit, AfterViewInit, OnDestroy {
    private readonly widgetService;
    private _widgetDragEnded;
    private _widgetPopover;
    private _element;
    constructor(widgetService: WidgetService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    onClickSetting(event: boolean): void;
    get widgetDragEnded(): Observable<any>;
    set widgetDragEnded(value: Observable<any>);
    get width(): number;
    _interpolatedWidth(): number;
    hideWidget(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WidgetComponent, "ga-widget", never, { "widgetDragEnded": { "alias": "widgetDragEnded"; "required": false; }; }, {}, never, never, false, never>;
}
