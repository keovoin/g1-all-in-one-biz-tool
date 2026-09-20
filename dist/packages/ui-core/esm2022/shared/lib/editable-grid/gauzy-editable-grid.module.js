import { NgModule } from '@angular/core';
import { NbButtonModule, NbIconModule, NbCardModule, NbListModule, NbDialogModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { GauzyEditableGridComponent } from './gauzy-editable-grid.component';
import { GauzyButtonActionModule } from '../gauzy-button-action';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
const NbModules = [NbButtonModule, NbIconModule, NbCardModule, NbListModule, NbDialogModule.forChild()];
const OtherModules = [GauzyButtonActionModule];
export class GauzyEditableGridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyEditableGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: GauzyEditableGridModule, declarations: [GauzyEditableGridComponent], imports: [NbButtonModule, NbIconModule, NbCardModule, NbListModule, i1.NbDialogModule, GauzyButtonActionModule, i2.TranslateModule], exports: [GauzyEditableGridComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyEditableGridModule, imports: [NbModules, OtherModules, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyEditableGridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [...NbModules, ...OtherModules, TranslateModule.forChild()],
                    declarations: [GauzyEditableGridComponent],
                    exports: [GauzyEditableGridComponent]
                }]
        }] });
//# sourceMappingURL=gauzy-editable-grid.module.js.map