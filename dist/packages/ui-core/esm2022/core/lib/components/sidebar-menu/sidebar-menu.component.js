import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { MenuItemComponent } from './menu-items/concrete/menu-item/menu-item.component';
import { SidebarMenuService } from '../../services/nav-builder/sidebar-menu.service';
import * as i0 from "@angular/core";
export class SidebarMenuComponent {
    constructor() {
        this._cdr = inject(ChangeDetectorRef);
        this._sidebarMenuService = inject(SidebarMenuService);
        this._items = [];
    }
    set items(value) {
        this._items = value;
    }
    get items() {
        return this._items;
    }
    get selectedItem() {
        return this._sidebarMenuService.selectedItem;
    }
    set selectedItem(value) {
        this._sidebarMenuService.selectedItem = value;
        this._cdr.detectChanges();
    }
    ngAfterContentChecked() {
        this._cdr.detectChanges();
    }
    ngAfterViewInit() {
        this._cdr.detectChanges();
    }
    /**
     * Sets the selected item in the sidebar menu and triggers change detection.
     *
     * @param event The menu item to focus on.
     */
    focusOn(event) {
        // Set the selected item in the sidebar menu
        this._sidebarMenuService.selectedItem = event;
        // Trigger change detection
        this._cdr.detectChanges();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SidebarMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SidebarMenuComponent, isStandalone: true, selector: "ga-sidebar-menu", inputs: { items: "items" }, ngImport: i0, template: "<div class=\"menu-container\">\n\t@for (item of items; track item.id) {\n\t\t@if (!item?.hidden) {\n\t\t\t<ga-menu-item\n\t\t\t\t[id]=\"item?.id\"\n\t\t\t\t(selectedChange)=\"focusOn($event)\"\n\t\t\t\t[item]=\"item\"\n\t\t\t\t[selected]=\"item === selectedItem\"\n\t\t\t></ga-menu-item>\n\t\t}\n\t}\n</div>\n", styles: [":host div.menu-container{background-color:transparent}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "component", type: MenuItemComponent, selector: "ga-menu-item", inputs: ["item", "collapse", "selected"], outputs: ["collapsedChange", "selectedChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SidebarMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-sidebar-menu', changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [CommonModule, MenuItemComponent], template: "<div class=\"menu-container\">\n\t@for (item of items; track item.id) {\n\t\t@if (!item?.hidden) {\n\t\t\t<ga-menu-item\n\t\t\t\t[id]=\"item?.id\"\n\t\t\t\t(selectedChange)=\"focusOn($event)\"\n\t\t\t\t[item]=\"item\"\n\t\t\t\t[selected]=\"item === selectedItem\"\n\t\t\t></ga-menu-item>\n\t\t}\n\t}\n</div>\n", styles: [":host div.menu-container{background-color:transparent}\n"] }]
        }], propDecorators: { items: [{
                type: Input
            }] } });
//# sourceMappingURL=sidebar-menu.component.js.map