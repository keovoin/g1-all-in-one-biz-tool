import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowModule } from '../window/window.module';
import { WindowLayoutComponent } from './window-layout.component';
import * as i0 from "@angular/core";
export class WindowLayoutModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WindowLayoutModule, declarations: [WindowLayoutComponent], imports: [CommonModule, WindowModule, DragDropModule], exports: [WindowLayoutComponent, WindowModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowLayoutModule, imports: [CommonModule, WindowModule, DragDropModule, WindowModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [WindowLayoutComponent],
                    imports: [CommonModule, WindowModule, DragDropModule],
                    exports: [WindowLayoutComponent, WindowModule]
                }]
        }] });
//# sourceMappingURL=window-layout.module.js.map