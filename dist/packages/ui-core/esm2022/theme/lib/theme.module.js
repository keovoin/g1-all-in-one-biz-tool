import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { NbActionsModule, NbLayoutModule, NbMenuModule, NbSearchModule, NbSidebarModule, NbUserModule, NbContextMenuModule, NbButtonModule, NbSelectModule, NbIconModule, NbThemeModule, NbPopoverModule, NbTooltipModule, NbLayoutDirectionService, NbSpinnerModule, CORPORATE_THEME, DARK_THEME, NbAccordionModule, NbToggleModule, NbCardModule } from '@nebular/theme';
import { NbSecurityModule } from '@nebular/security';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { CommonNavModule, LanguagesService, OrganizationsService, SelectorService, UsersOrganizationsService } from '@gauzy/ui-core/core';
import { DirectivesModule, SelectorsModule, TimeTrackerModule, TimeTrackerStatusModule, WorkspacesModule } from '@gauzy/ui-core/shared';
import { TablerIconsModule } from '@gauzy/ui-core/icons';
import { OneColumnLayoutComponent, ThreeColumnsLayoutComponent, TwoColumnsLayoutComponent, PublicLayoutComponent } from './layouts';
import { COSMIC_THEME, DEFAULT_THEME, GAUZY_DARK, GAUZY_LIGHT, MATERIAL_DARK_THEME, MATERIAL_LIGHT_THEME } from './themes';
import { WindowModeBlockScrollService } from './services/window-mode-block-scroll.service';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ThemeSidebarModule } from './components/theme-sidebar/theme-sidebar.module';
import { GauzyLogoComponent } from './components/gauzy-logo/gauzy-logo.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { UserComponent } from './components/user/user.component';
import { WorkspaceMenuComponent } from './components/workspace-menu/workspace-menu.component';
import { ThemeSelectorModule } from './components/theme-sidebar/theme-settings/components/theme-selector/theme-selector.module';
import { ThemeLanguageSelectorModule } from './components/theme-sidebar/theme-settings/components/theme-language-selector/theme-language-selector.module';
import { ThemeLanguageSelectorService } from './components/theme-sidebar/theme-settings/components/theme-language-selector/theme-language-selector.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "ngx-permissions";
const NB_MODULES = [
    NbLayoutModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbSearchModule,
    NbSidebarModule,
    NbContextMenuModule,
    NbSecurityModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbTooltipModule,
    NbPopoverModule,
    TablerIconsModule,
    NbAccordionModule,
    NbToggleModule,
    NbCardModule,
    NbSpinnerModule
];
const MODULES = [
    SelectorsModule,
    TranslateModule.forChild(),
    NgxPermissionsModule.forChild(),
    ThemeLanguageSelectorModule,
    ThemeSelectorModule,
    WorkspacesModule,
    CommonNavModule,
    DirectivesModule,
    TimeTrackerModule,
    TimeTrackerStatusModule
];
const COMPONENTS = [
    HeaderComponent,
    FooterComponent,
    OneColumnLayoutComponent,
    ThreeColumnsLayoutComponent,
    TwoColumnsLayoutComponent,
    PublicLayoutComponent,
    GauzyLogoComponent,
    UserMenuComponent,
    UserComponent,
    WorkspaceMenuComponent
];
const EXPORT_IMPORT = [ThemeSidebarModule, MatRippleModule];
export class ThemeModule {
    /**
     * Returns a ModuleWithProviders object that can be used to configure the ThemeModule.
     *
     * @return {ModuleWithProviders<ThemeModule>} The ModuleWithProviders object containing the ThemeModule and an empty providers array.
     */
    static forRoot() {
        return {
            ngModule: ThemeModule,
            providers: [
                ...NbThemeModule.forRoot({ name: GAUZY_LIGHT.name }, [
                    DEFAULT_THEME,
                    COSMIC_THEME,
                    CORPORATE_THEME,
                    DARK_THEME,
                    MATERIAL_LIGHT_THEME,
                    MATERIAL_DARK_THEME,
                    GAUZY_LIGHT,
                    GAUZY_DARK
                ]).providers,
                WindowModeBlockScrollService
            ]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ThemeModule, declarations: [HeaderComponent,
            FooterComponent,
            OneColumnLayoutComponent,
            ThreeColumnsLayoutComponent,
            TwoColumnsLayoutComponent,
            PublicLayoutComponent,
            GauzyLogoComponent,
            UserMenuComponent,
            UserComponent,
            WorkspaceMenuComponent], imports: [CommonModule, RouterModule, ThemeSidebarModule, MatRippleModule, NbLayoutModule,
            NbMenuModule,
            NbUserModule,
            NbActionsModule,
            NbSearchModule,
            NbSidebarModule,
            NbContextMenuModule,
            NbSecurityModule,
            NbButtonModule,
            NbSelectModule,
            NbIconModule,
            NbTooltipModule,
            NbPopoverModule,
            TablerIconsModule,
            NbAccordionModule,
            NbToggleModule,
            NbCardModule,
            NbSpinnerModule, SelectorsModule, i1.TranslateModule, i2.NgxPermissionsModule, ThemeLanguageSelectorModule,
            ThemeSelectorModule,
            WorkspacesModule,
            CommonNavModule,
            DirectivesModule,
            TimeTrackerModule,
            TimeTrackerStatusModule], exports: [ThemeSidebarModule, MatRippleModule, HeaderComponent,
            FooterComponent,
            OneColumnLayoutComponent,
            ThreeColumnsLayoutComponent,
            TwoColumnsLayoutComponent,
            PublicLayoutComponent,
            GauzyLogoComponent,
            UserMenuComponent,
            UserComponent,
            WorkspaceMenuComponent, NbIconModule, TablerIconsModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeModule, providers: [
            SelectorService,
            UsersOrganizationsService,
            OrganizationsService,
            NbLayoutDirectionService,
            LanguagesService,
            ThemeLanguageSelectorService
        ], imports: [CommonModule, RouterModule, EXPORT_IMPORT, NB_MODULES, MODULES, ThemeSidebarModule, MatRippleModule, NbIconModule, TablerIconsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, ...EXPORT_IMPORT, ...NB_MODULES, ...MODULES],
                    exports: [...EXPORT_IMPORT, ...COMPONENTS, NbIconModule, TablerIconsModule],
                    declarations: [...COMPONENTS],
                    providers: [
                        SelectorService,
                        UsersOrganizationsService,
                        OrganizationsService,
                        NbLayoutDirectionService,
                        LanguagesService,
                        ThemeLanguageSelectorService
                    ]
                }]
        }] });
//# sourceMappingURL=theme.module.js.map