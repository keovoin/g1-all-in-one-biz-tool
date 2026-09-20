import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteBaseComponent } from './delete-base.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class DeleteBaseModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteBaseModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DeleteBaseModule, declarations: [DeleteBaseComponent], imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, i1.TranslateModule], exports: [DeleteBaseComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteBaseModule, imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteBaseModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()],
                    declarations: [DeleteBaseComponent],
                    exports: [DeleteBaseComponent]
                }]
        }] });
//# sourceMappingURL=delete-base.module.js.map