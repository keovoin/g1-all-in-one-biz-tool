import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteCategoryComponent } from './delete-category.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class DeleteCategoryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteCategoryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DeleteCategoryModule, declarations: [DeleteCategoryComponent], imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, i1.TranslateModule], exports: [DeleteCategoryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteCategoryModule, imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteCategoryModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()],
                    declarations: [DeleteCategoryComponent],
                    exports: [DeleteCategoryComponent]
                }]
        }] });
//# sourceMappingURL=delete-category.module.js.map