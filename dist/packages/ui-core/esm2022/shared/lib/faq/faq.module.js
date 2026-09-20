import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NgxFaqComponent } from './faq.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class NgxFaqModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NgxFaqModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: NgxFaqModule, declarations: [NgxFaqComponent], imports: [CommonModule, NbButtonModule, NbIconModule, i1.TranslateModule], exports: [NgxFaqComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NgxFaqModule, imports: [CommonModule, NbButtonModule, NbIconModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NgxFaqModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbIconModule, TranslateModule.forChild()],
                    declarations: [NgxFaqComponent],
                    exports: [NgxFaqComponent]
                }]
        }] });
//# sourceMappingURL=faq.module.js.map