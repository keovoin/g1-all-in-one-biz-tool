import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule, NbDialogModule, NbIconModule, NbAlertModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { TableComponentsModule } from '../../table-components';
import { ViewTimeLogModalComponent } from './view-time-log-modal.component';
import { EditTimeLogModalModule } from '../edit-time-log-modal/edit-time-log-modal.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
export class ViewTimeLogModalModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModalModule, declarations: [ViewTimeLogModalComponent], imports: [CommonModule, i1.TranslateModule, SharedModule,
            NbCardModule,
            NbButtonModule, i2.NbDialogModule, EditTimeLogModalModule,
            NbIconModule,
            DialogsModule,
            NbAlertModule,
            TableComponentsModule], exports: [ViewTimeLogModalComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModalModule, imports: [CommonModule,
            TranslateModule.forChild(),
            SharedModule,
            NbCardModule,
            NbButtonModule,
            NbDialogModule.forChild(),
            EditTimeLogModalModule,
            NbIconModule,
            DialogsModule,
            NbAlertModule,
            TableComponentsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModalModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ViewTimeLogModalComponent],
                    exports: [ViewTimeLogModalComponent],
                    imports: [
                        CommonModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        NbCardModule,
                        NbButtonModule,
                        NbDialogModule.forChild(),
                        EditTimeLogModalModule,
                        NbIconModule,
                        DialogsModule,
                        NbAlertModule,
                        TableComponentsModule
                    ]
                }]
        }] });
//# sourceMappingURL=view-time-log-modal.module.js.map