import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { BaseNavMenuComponent } from '../base-nav-menu/base-nav-menu.component';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let SettingsNavMenuComponent = class SettingsNavMenuComponent extends BaseNavMenuComponent {
    ngOnInit() {
        super.ngOnInit(); // Call the parent class's ngOnInit function
        // Subscribe to the menuConfig$ observable provided by _navMenuBuilderService
        this.settingsMenuConfig$ = this._navMenuBuilderService.menuConfig$.pipe(map((sections) => this.mapMenuSections(sections ?? [])
            .filter((section) => section.menuCategory === 'settings')
            // Render each settings section as a plain link (no inline accordion):
            // the full settings menu now lives on the /pages/settings page itself.
            .map((section) => ({ ...section, children: undefined }))), untilDestroyed(this));
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SettingsNavMenuComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: SettingsNavMenuComponent, isStandalone: true, selector: "ga-settings-nav-menu", usesInheritance: true, ngImport: i0, template: "<ga-sidebar-menu [items]=\"settingsMenuConfig$ | async\"></ga-sidebar-menu>\n", styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "component", type: SidebarMenuComponent, selector: "ga-sidebar-menu", inputs: ["items"] }, { kind: "pipe", type: i1.AsyncPipe, name: "async" }] }); }
};
SettingsNavMenuComponent = __decorate([
    UntilDestroy()
], SettingsNavMenuComponent);
export { SettingsNavMenuComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SettingsNavMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-settings-nav-menu', standalone: true, imports: [CommonModule, SidebarMenuComponent], template: "<ga-sidebar-menu [items]=\"settingsMenuConfig$ | async\"></ga-sidebar-menu>\n" }]
        }] });
//# sourceMappingURL=settings-nav-menu.component.js.map