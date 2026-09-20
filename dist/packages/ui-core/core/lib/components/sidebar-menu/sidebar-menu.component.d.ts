import { AfterContentChecked, AfterViewInit } from '@angular/core';
import { IMenuItem } from './menu-items/interface/menu-item.interface';
import * as i0 from "@angular/core";
export declare class SidebarMenuComponent implements AfterContentChecked, AfterViewInit {
    private readonly _cdr;
    private readonly _sidebarMenuService;
    private _items;
    set items(value: IMenuItem[]);
    get items(): IMenuItem[];
    get selectedItem(): IMenuItem;
    set selectedItem(value: IMenuItem);
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    /**
     * Sets the selected item in the sidebar menu and triggers change detection.
     *
     * @param event The menu item to focus on.
     */
    focusOn(event: IMenuItem): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SidebarMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SidebarMenuComponent, "ga-sidebar-menu", never, { "items": { "alias": "items"; "required": false; }; }, {}, never, never, true, never>;
}
