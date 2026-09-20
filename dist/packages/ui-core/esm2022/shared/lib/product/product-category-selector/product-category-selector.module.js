import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCategorySelectorComponent } from './product-category-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProductCategorySelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategorySelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProductCategorySelectorModule, declarations: [ProductCategorySelectorComponent], imports: [CommonModule, FormsModule, i1.TranslateModule, NgSelectModule], exports: [ProductCategorySelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategorySelectorModule, imports: [CommonModule, FormsModule, TranslateModule.forChild(), NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategorySelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ProductCategorySelectorComponent],
                    exports: [ProductCategorySelectorComponent],
                    imports: [CommonModule, FormsModule, TranslateModule.forChild(), NgSelectModule]
                }]
        }] });
//# sourceMappingURL=product-category-selector.module.js.map