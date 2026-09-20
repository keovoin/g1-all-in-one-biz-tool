import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbProgressBarModule } from '@nebular/theme';
import { ProgressStatusComponent } from './progress-status/progress-status.component';
import * as i0 from "@angular/core";
export class ProgressStatusModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProgressStatusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProgressStatusModule, declarations: [ProgressStatusComponent], imports: [CommonModule, NbProgressBarModule], exports: [ProgressStatusComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProgressStatusModule, imports: [CommonModule, NbProgressBarModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProgressStatusModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbProgressBarModule],
                    declarations: [ProgressStatusComponent],
                    exports: [ProgressStatusComponent]
                }]
        }] });
//# sourceMappingURL=progress-status.module.js.map