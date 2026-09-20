import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbBadgeModule, NbSelectModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './language-selector.component';
import { LanguagesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class LanguageSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: LanguageSelectorModule, declarations: [LanguageSelectorComponent], imports: [CommonModule, NbSelectModule, NbBadgeModule, FormsModule, NgSelectModule, i1.TranslateModule], exports: [LanguageSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageSelectorModule, providers: [LanguagesService], imports: [CommonModule, NbSelectModule, NbBadgeModule, FormsModule, NgSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbSelectModule, NbBadgeModule, FormsModule, NgSelectModule, TranslateModule.forChild()],
                    exports: [LanguageSelectorComponent],
                    declarations: [LanguageSelectorComponent],
                    providers: [LanguagesService]
                }]
        }] });
//# sourceMappingURL=language-selector.module.js.map