import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from '../../skeleton/skeleton.module';
import { NoDataMessageComponent } from './no-data-message.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class NoDataMessageModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoDataMessageModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: NoDataMessageModule, declarations: [NoDataMessageComponent], imports: [CommonModule, NbCardModule, NbIconModule, i1.TranslateModule, SkeletonModule], exports: [NoDataMessageComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoDataMessageModule, imports: [CommonModule, NbCardModule, NbIconModule, TranslateModule.forChild(), SkeletonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoDataMessageModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbCardModule, NbIconModule, TranslateModule.forChild(), SkeletonModule],
                    declarations: [NoDataMessageComponent],
                    exports: [NoDataMessageComponent]
                }]
        }] });
//# sourceMappingURL=no-data-message.module.js.map