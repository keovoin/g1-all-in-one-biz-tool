import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WidgetLayoutComponent } from './widget-layout.component';
import { WidgetModule } from '../widget/widget.module';
import * as i0 from "@angular/core";
export class WidgetLayoutModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WidgetLayoutModule, declarations: [WidgetLayoutComponent], imports: [CommonModule, WidgetModule, DragDropModule], exports: [WidgetLayoutComponent, WidgetModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetLayoutModule, imports: [CommonModule, WidgetModule, DragDropModule, WidgetModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [WidgetLayoutComponent],
                    imports: [CommonModule, WidgetModule, DragDropModule],
                    exports: [WidgetLayoutComponent, WidgetModule]
                }]
        }] });
//# sourceMappingURL=widget-layout.module.js.map