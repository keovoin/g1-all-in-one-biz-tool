import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { GauzyButtonActionComponent } from './gauzy-button-action.component';
import { ComponentsModule } from '../components/components.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class GauzyButtonActionModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyButtonActionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: GauzyButtonActionModule, declarations: [GauzyButtonActionComponent], imports: [CommonModule, NbButtonModule, NbIconModule, i1.TranslateModule, ComponentsModule], exports: [GauzyButtonActionComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyButtonActionModule, imports: [CommonModule, NbButtonModule, NbIconModule, TranslateModule.forChild(), ComponentsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyButtonActionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbIconModule, TranslateModule.forChild(), ComponentsModule],
                    declarations: [GauzyButtonActionComponent],
                    exports: [GauzyButtonActionComponent]
                }]
        }] });
//# sourceMappingURL=gauzy-button-action.module.js.map