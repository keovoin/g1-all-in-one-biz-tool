import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseNavMenuComponent } from '../base-nav-menu/base-nav-menu.component';
import { NavMenuCategory, NavMenuSectionItem } from '../../services/nav-builder/nav-builder-types';
import * as i0 from "@angular/core";
export declare class MainNavMenuComponent extends BaseNavMenuComponent implements OnInit {
    readonly menuCategory: import("@angular/core").InputSignal<NavMenuCategory>;
    mainMenuConfig$: Observable<NavMenuSectionItem[]>;
    ngOnInit(): void;
    /**
     * Filters the provided menu sections based on the specified menu category.
     *
     * @param sections - An array of navigation menu section items to filter.
     * @returns An array of navigation menu section items that match the specified menu category.
     */
    private filterSectionsByCategory;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MainNavMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MainNavMenuComponent, "ga-main-nav-menu", never, { "menuCategory": { "alias": "menuCategory"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
