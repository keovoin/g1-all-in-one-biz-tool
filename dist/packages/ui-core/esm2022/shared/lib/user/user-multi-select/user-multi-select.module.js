import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { UserSelectComponent } from './user-multi-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class UserMultiSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMultiSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UserMultiSelectModule, declarations: [UserSelectComponent], imports: [CommonModule, NbSelectModule, i1.TranslateModule], exports: [UserSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMultiSelectModule, imports: [CommonModule, NbSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMultiSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbSelectModule, TranslateModule.forChild()],
                    declarations: [UserSelectComponent],
                    exports: [UserSelectComponent]
                }]
        }] });
//# sourceMappingURL=user-multi-select.module.js.map