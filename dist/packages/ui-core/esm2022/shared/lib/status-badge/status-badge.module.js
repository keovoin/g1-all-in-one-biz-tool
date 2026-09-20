import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbBadgeModule } from '@nebular/theme';
import { StatusBadgeComponent } from './status-badge.component';
import * as i0 from "@angular/core";
export class StatusBadgeModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeModule, declarations: [StatusBadgeComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, NbBadgeModule], exports: [StatusBadgeComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, NbBadgeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, NbBadgeModule],
                    exports: [StatusBadgeComponent],
                    declarations: [StatusBadgeComponent]
                }]
        }] });
//# sourceMappingURL=status-badge.module.js.map