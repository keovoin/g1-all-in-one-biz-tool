import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbIconModule, NbPopoverModule, NbSelectModule, NbToggleModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeSelectorContainerComponent } from './container/theme-selector-container.component';
import { SwitchThemeComponent } from './switch-theme/switch-theme.component';
import { ThemeSelectorImageComponent } from './theme-selector-image/theme-selector-image.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ThemeSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorModule, declarations: [ThemeSelectorComponent,
            SwitchThemeComponent,
            ThemeSelectorImageComponent,
            ThemeSelectorContainerComponent], imports: [CommonModule,
            NbSelectModule,
            NbToggleModule, i1.TranslateModule, NbButtonModule,
            NbIconModule,
            NbPopoverModule], exports: [ThemeSelectorComponent,
            SwitchThemeComponent,
            ThemeSelectorImageComponent,
            ThemeSelectorContainerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorModule, imports: [CommonModule,
            NbSelectModule,
            NbToggleModule,
            TranslateModule.forChild(),
            NbButtonModule,
            NbIconModule,
            NbPopoverModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        ThemeSelectorComponent,
                        SwitchThemeComponent,
                        ThemeSelectorImageComponent,
                        ThemeSelectorContainerComponent
                    ],
                    exports: [
                        ThemeSelectorComponent,
                        SwitchThemeComponent,
                        ThemeSelectorImageComponent,
                        ThemeSelectorContainerComponent
                    ],
                    imports: [
                        CommonModule,
                        NbSelectModule,
                        NbToggleModule,
                        TranslateModule.forChild(),
                        NbButtonModule,
                        NbIconModule,
                        NbPopoverModule
                    ]
                }]
        }] });
//# sourceMappingURL=theme-selector.module.js.map