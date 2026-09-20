import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, map } from 'rxjs';
import { BaseNavMenuComponent } from '../base-nav-menu/base-nav-menu.component';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let MainNavMenuComponent = class MainNavMenuComponent extends BaseNavMenuComponent {
    constructor() {
        super(...arguments);
        // Define the input signal menuCategory of type NavMenuCategory | undefined
        this.menuCategory = input(...(ngDevMode ? [undefined, { debugName: "menuCategory" }] : []));
    }
    ngOnInit() {
        super.ngOnInit(); // Call the parent class's ngOnInit function
        // Subscribe to the menuConfig$ observable provided by _navMenuBuilderService
        this.mainMenuConfig$ = this._navMenuBuilderService.menuConfig$.pipe(map((sections) => this.filterSectionsByCategory(sections)), catchError((error) => {
            console.error('Error while retrieving main menu sections:', error);
            return [];
        }), untilDestroyed(this));
    }
    /**
     * Filters the provided menu sections based on the specified menu category.
     *
     * @param sections - An array of navigation menu section items to filter.
     * @returns An array of navigation menu section items that match the specified menu category.
     */
    filterSectionsByCategory(sections) {
        return this.mapMenuSections(sections ?? []).filter((section) => this.menuCategory() ? section?.menuCategory === this.menuCategory() : !section?.menuCategory);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MainNavMenuComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.0.7", type: MainNavMenuComponent, isStandalone: true, selector: "ga-main-nav-menu", inputs: { menuCategory: { classPropertyName: "menuCategory", publicName: "menuCategory", isSignal: true, isRequired: false, transformFunction: null } }, usesInheritance: true, ngImport: i0, template: "<ga-sidebar-menu [items]=\"mainMenuConfig$ | async\"></ga-sidebar-menu>\n", styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "component", type: SidebarMenuComponent, selector: "ga-sidebar-menu", inputs: ["items"] }, { kind: "pipe", type: i1.AsyncPipe, name: "async" }] }); }
};
MainNavMenuComponent = __decorate([
    UntilDestroy()
], MainNavMenuComponent);
export { MainNavMenuComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MainNavMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-main-nav-menu', standalone: true, imports: [CommonModule, SidebarMenuComponent], template: "<ga-sidebar-menu [items]=\"mainMenuConfig$ | async\"></ga-sidebar-menu>\n" }]
        }], propDecorators: { menuCategory: [{ type: i0.Input, args: [{ isSignal: true, alias: "menuCategory", required: false }] }] } });
//# sourceMappingURL=main-nav-menu.component.js.map