import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NbAccordionModule, NbButtonModule, NbTooltipModule } from '@nebular/theme';
import { BaseNavMenuComponent } from './base-nav-menu/base-nav-menu.component';
import { MainNavMenuComponent } from './main-nav-menu/main-nav-menu.component';
import { SettingsNavMenuComponent } from './settings-nav-menu/settings-nav-menu.component';
import { MenuItemComponent, SidebarMenuComponent, ChildrenMenuItemComponent } from './sidebar-menu';
import { TooltipDirective } from '../directives/tooltip.directive';
import * as i0 from "@angular/core";
import * as i1 from "ngx-permissions";
// Components that are standalone
const STANDALONE_COMPONENTS = [
    BaseNavMenuComponent,
    MainNavMenuComponent,
    SidebarMenuComponent,
    MenuItemComponent,
    ChildrenMenuItemComponent,
    SettingsNavMenuComponent
];
export class CommonNavModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommonNavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CommonNavModule, imports: [CommonModule,
            NbAccordionModule,
            NbTooltipModule,
            NbButtonModule, i1.NgxPermissionsModule, TooltipDirective, BaseNavMenuComponent,
            MainNavMenuComponent,
            SidebarMenuComponent,
            MenuItemComponent,
            ChildrenMenuItemComponent,
            SettingsNavMenuComponent], exports: [BaseNavMenuComponent,
            MainNavMenuComponent,
            SidebarMenuComponent,
            MenuItemComponent,
            ChildrenMenuItemComponent,
            SettingsNavMenuComponent, TooltipDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommonNavModule, imports: [CommonModule,
            NbAccordionModule,
            NbTooltipModule,
            NbButtonModule,
            NgxPermissionsModule.forChild(), MainNavMenuComponent,
            SidebarMenuComponent,
            MenuItemComponent,
            ChildrenMenuItemComponent,
            SettingsNavMenuComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommonNavModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbAccordionModule,
                        NbTooltipModule,
                        NbButtonModule,
                        NgxPermissionsModule.forChild(),
                        TooltipDirective,
                        ...STANDALONE_COMPONENTS
                    ],
                    declarations: [],
                    exports: [...STANDALONE_COMPONENTS, TooltipDirective]
                }]
        }] });
//# sourceMappingURL=common-nav.module.js.map