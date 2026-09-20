import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { CountryComponent } from './country.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CountryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CountryModule, declarations: [CountryComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, i1.TranslateModule], exports: [CountryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, TranslateModule.forChild()],
                    declarations: [CountryComponent],
                    exports: [CountryComponent]
                }]
        }] });
//# sourceMappingURL=country.module.js.map