import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbDialogModule, NbIconModule, NbListModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { SharedModule } from '../../shared.module';
import { ViewTimeLogComponent } from './view-time-log.component';
import { EditTimeLogModalModule } from '../edit-time-log-modal/edit-time-log-modal.module';
import { ViewTimeLogModalModule } from '../view-time-log-modal/view-time-log-modal.module';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class ViewTimeLogModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModule, declarations: [ViewTimeLogComponent], imports: [CommonModule,
            NbButtonModule, i1.NbDialogModule, NbIconModule,
            NbListModule,
            NbTooltipModule,
            NbUserModule,
            NgxPermissionsModule, i2.TranslateModule, SharedModule,
            DialogsModule,
            EditTimeLogModalModule,
            ViewTimeLogModalModule], exports: [ViewTimeLogComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModule, imports: [CommonModule,
            NbButtonModule,
            NbDialogModule.forChild(),
            NbIconModule,
            NbListModule,
            NbTooltipModule,
            NbUserModule,
            NgxPermissionsModule,
            TranslateModule.forChild(),
            SharedModule,
            DialogsModule,
            EditTimeLogModalModule,
            ViewTimeLogModalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ViewTimeLogComponent],
                    exports: [ViewTimeLogComponent],
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbDialogModule.forChild(),
                        NbIconModule,
                        NbListModule,
                        NbTooltipModule,
                        NbUserModule,
                        NgxPermissionsModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        DialogsModule,
                        EditTimeLogModalModule,
                        ViewTimeLogModalModule
                    ]
                }]
        }] });
//# sourceMappingURL=view-time-log.module.js.map