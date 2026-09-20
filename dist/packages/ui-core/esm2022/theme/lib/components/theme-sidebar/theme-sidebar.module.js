import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ChangelogEntryComponent, DirectivesModule } from '@gauzy/ui-core/shared';
import { ThemeSidebarComponent } from './theme-sidebar.component';
import { ThemeSettingsModule } from './theme-settings/theme-settings.module';
import { ChangelogComponent } from './changelog/changelog.component';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ThemeSidebarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSidebarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ThemeSidebarModule, declarations: [ThemeSidebarComponent, ChangelogComponent], imports: [CommonModule,
            NbButtonModule,
            NbSelectModule,
            NbIconModule,
            NbTooltipModule, i1.TranslateModule, ThemeSettingsModule,
            DirectivesModule,
            // Standalone card shared with the login page's What's New panel
            ChangelogEntryComponent], exports: [ThemeSidebarComponent, ChangelogComponent, ThemeSettingsComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSidebarModule, imports: [CommonModule,
            NbButtonModule,
            NbSelectModule,
            NbIconModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            ThemeSettingsModule,
            DirectivesModule,
            // Standalone card shared with the login page's What's New panel
            ChangelogEntryComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSidebarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbSelectModule,
                        NbIconModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        ThemeSettingsModule,
                        DirectivesModule,
                        // Standalone card shared with the login page's What's New panel
                        ChangelogEntryComponent
                    ],
                    exports: [ThemeSidebarComponent, ChangelogComponent, ThemeSettingsComponent],
                    declarations: [ThemeSidebarComponent, ChangelogComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=theme-sidebar.module.js.map