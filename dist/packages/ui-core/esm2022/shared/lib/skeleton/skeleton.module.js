import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonComponent } from './skeleton.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class SkeletonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkeletonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SkeletonModule, declarations: [SkeletonComponent], imports: [CommonModule, i1.TranslateModule], exports: [SkeletonComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkeletonModule, imports: [CommonModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkeletonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, TranslateModule.forChild()],
                    declarations: [SkeletonComponent],
                    exports: [SkeletonComponent]
                }]
        }] });
//# sourceMappingURL=skeleton.module.js.map