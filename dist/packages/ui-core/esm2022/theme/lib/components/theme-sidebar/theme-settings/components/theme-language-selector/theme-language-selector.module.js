import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeLanguageSelectorComponent } from './theme-language-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ThemeLanguageSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorModule, declarations: [ThemeLanguageSelectorComponent], imports: [CommonModule, NbButtonModule, NbSelectModule, i1.TranslateModule], exports: [ThemeLanguageSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorModule, imports: [CommonModule, NbButtonModule, NbSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbSelectModule, TranslateModule.forChild()],
                    exports: [ThemeLanguageSelectorComponent],
                    declarations: [ThemeLanguageSelectorComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=theme-language-selector.module.js.map