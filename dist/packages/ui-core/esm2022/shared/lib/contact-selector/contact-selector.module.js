import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSelectModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContactSelectorComponent } from './contact-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ContactSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectorModule, declarations: [ContactSelectorComponent], imports: [CommonModule, NbSelectModule, FormsModule, i1.TranslateModule, NgSelectModule], exports: [ContactSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectorModule, imports: [CommonModule, NbSelectModule, FormsModule, TranslateModule.forChild(), NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ContactSelectorComponent],
                    exports: [ContactSelectorComponent],
                    imports: [CommonModule, NbSelectModule, FormsModule, TranslateModule.forChild(), NgSelectModule]
                }]
        }] });
//# sourceMappingURL=contact-selector.module.js.map