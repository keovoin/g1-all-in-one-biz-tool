import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { UserOrganizationsSelectComponent } from './user-organizations-multi-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class UserOrganizationsMultiSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserOrganizationsMultiSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UserOrganizationsMultiSelectModule, declarations: [UserOrganizationsSelectComponent], imports: [CommonModule, NbSelectModule, i1.TranslateModule], exports: [UserOrganizationsSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserOrganizationsMultiSelectModule, imports: [CommonModule, NbSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserOrganizationsMultiSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbSelectModule, TranslateModule.forChild()],
                    declarations: [UserOrganizationsSelectComponent],
                    exports: [UserOrganizationsSelectComponent]
                }]
        }] });
//# sourceMappingURL=user-organizations-multi-select.module.js.map