import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseNavMenuComponent } from '../base-nav-menu/base-nav-menu.component';
import { NavMenuSectionItem } from '../../services/nav-builder/nav-builder-types';
import * as i0 from "@angular/core";
export declare class SettingsNavMenuComponent extends BaseNavMenuComponent implements OnInit {
    settingsMenuConfig$: Observable<NavMenuSectionItem[]>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SettingsNavMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SettingsNavMenuComponent, "ga-settings-nav-menu", never, {}, {}, never, never, true, never>;
}
