import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GuiDrag } from '@gauzy/ui-core/common';
import { WindowService } from './window.service';
import * as i0 from "@angular/core";
export declare class WindowComponent extends GuiDrag implements OnInit, AfterViewInit, OnDestroy {
    private readonly windowService;
    private _windowDragEnded;
    private _windowPopover;
    private _element;
    constructor(windowService: WindowService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    onClickSetting(event: boolean): void;
    get windowDragEnded(): Observable<any>;
    set windowDragEnded(value: Observable<any>);
    hideWindow(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WindowComponent, "ga-window", never, { "windowDragEnded": { "alias": "windowDragEnded"; "required": false; }; }, {}, never, never, false, never>;
}
