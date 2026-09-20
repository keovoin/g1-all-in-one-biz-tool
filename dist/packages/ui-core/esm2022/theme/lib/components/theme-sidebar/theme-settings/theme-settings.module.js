import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '@gauzy/ui-core/shared';
import { NbButtonModule, NbCardModule, NbIconModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutSelectorModule } from './components/layout-selector/layout-selector.module';
import { ThemeLanguageSelectorModule } from './components/theme-language-selector/theme-language-selector.module';
import { ThemeSelectorModule } from './components/theme-selector/theme-selector.module';
import { ThemeSettingsComponent } from './theme-settings.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ThemeSettingsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSettingsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ThemeSettingsModule, declarations: [ThemeSettingsComponent], imports: [CommonModule,
            NbButtonModule,
            NbSelectModule,
            NbIconModule,
            NbTooltipModule, i1.TranslateModule, ThemeLanguageSelectorModule,
            LayoutSelectorModule,
            ThemeSelectorModule,
            NbCardModule,
            DirectivesModule], exports: [ThemeSettingsComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSettingsModule, imports: [CommonModule,
            NbButtonModule,
            NbSelectModule,
            NbIconModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            ThemeLanguageSelectorModule,
            LayoutSelectorModule,
            ThemeSelectorModule,
            NbCardModule,
            DirectivesModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSettingsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbSelectModule,
                        NbIconModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        ThemeLanguageSelectorModule,
                        LayoutSelectorModule,
                        ThemeSelectorModule,
                        NbCardModule,
                        DirectivesModule
                    ],
                    exports: [ThemeSettingsComponent],
                    declarations: [ThemeSettingsComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=theme-settings.module.js.map