import { ModuleWithProviders } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./components/header/header.component";
import * as i2 from "./components/footer/footer.component";
import * as i3 from "./layouts/one-column/one-column.layout";
import * as i4 from "./layouts/three-columns/three-columns.layout";
import * as i5 from "./layouts/two-columns/two-columns.layout";
import * as i6 from "./layouts/public/public.layout";
import * as i7 from "./components/gauzy-logo/gauzy-logo.component";
import * as i8 from "./components/user-menu/user-menu.component";
import * as i9 from "./components/user/user.component";
import * as i10 from "./components/workspace-menu/workspace-menu.component";
import * as i11 from "@angular/common";
import * as i12 from "@angular/router";
import * as i13 from "./components/theme-sidebar/theme-sidebar.module";
import * as i14 from "@angular/material/core";
import * as i15 from "@nebular/theme";
import * as i16 from "@nebular/security";
import * as i17 from "@gauzy/ui-core/icons";
import * as i18 from "@gauzy/ui-core/shared";
import * as i19 from "@ngx-translate/core";
import * as i20 from "ngx-permissions";
import * as i21 from "./components/theme-sidebar/theme-settings/components/theme-language-selector/theme-language-selector.module";
import * as i22 from "./components/theme-sidebar/theme-settings/components/theme-selector/theme-selector.module";
import * as i23 from "@gauzy/ui-core/core";
export declare class ThemeModule {
    /**
     * Returns a ModuleWithProviders object that can be used to configure the ThemeModule.
     *
     * @return {ModuleWithProviders<ThemeModule>} The ModuleWithProviders object containing the ThemeModule and an empty providers array.
     */
    static forRoot(): ModuleWithProviders<ThemeModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ThemeModule, [typeof i1.HeaderComponent, typeof i2.FooterComponent, typeof i3.OneColumnLayoutComponent, typeof i4.ThreeColumnsLayoutComponent, typeof i5.TwoColumnsLayoutComponent, typeof i6.PublicLayoutComponent, typeof i7.GauzyLogoComponent, typeof i8.UserMenuComponent, typeof i9.UserComponent, typeof i10.WorkspaceMenuComponent], [typeof i11.CommonModule, typeof i12.RouterModule, typeof i13.ThemeSidebarModule, typeof i14.MatRippleModule, typeof i15.NbLayoutModule, typeof i15.NbMenuModule, typeof i15.NbUserModule, typeof i15.NbActionsModule, typeof i15.NbSearchModule, typeof i15.NbSidebarModule, typeof i15.NbContextMenuModule, typeof i16.NbSecurityModule, typeof i15.NbButtonModule, typeof i15.NbSelectModule, typeof i15.NbIconModule, typeof i15.NbTooltipModule, typeof i15.NbPopoverModule, typeof i17.TablerIconsModule, typeof i15.NbAccordionModule, typeof i15.NbToggleModule, typeof i15.NbCardModule, typeof i15.NbSpinnerModule, typeof i18.SelectorsModule, typeof i19.TranslateModule, typeof i20.NgxPermissionsModule, typeof i21.ThemeLanguageSelectorModule, typeof i22.ThemeSelectorModule, typeof i18.WorkspacesModule, typeof i23.CommonNavModule, typeof i18.DirectivesModule, typeof i18.TimeTrackerModule, typeof i18.TimeTrackerStatusModule], [typeof i13.ThemeSidebarModule, typeof i14.MatRippleModule, typeof i1.HeaderComponent, typeof i2.FooterComponent, typeof i3.OneColumnLayoutComponent, typeof i4.ThreeColumnsLayoutComponent, typeof i5.TwoColumnsLayoutComponent, typeof i6.PublicLayoutComponent, typeof i7.GauzyLogoComponent, typeof i8.UserMenuComponent, typeof i9.UserComponent, typeof i10.WorkspaceMenuComponent, typeof i15.NbIconModule, typeof i17.TablerIconsModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ThemeModule>;
}
