import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbProgressBarModule, NbTooltipModule } from '@nebular/theme';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MomentModule } from 'ngx-moment';
import { TranslateModule } from '@ngx-translate/core';
import { DialogsModule } from '../../../dialogs/dialogs.module';
import { TableComponentsModule } from '../../../table-components';
import { SharedModule } from '../../../shared.module';
import { GalleryModule } from '../../../gallery/gallery.module';
import { ViewScreenshotsModalComponent } from './view-screenshots-modal.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "ngx-permissions";
import * as i3 from "@ngx-translate/core";
export class ViewScreenshotsModalModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewScreenshotsModalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ViewScreenshotsModalModule, declarations: [ViewScreenshotsModalComponent], imports: [CommonModule,
            NbAlertModule,
            NbButtonModule,
            NbCardModule, i1.NbDialogModule, NbIconModule,
            NbProgressBarModule,
            NbTooltipModule,
            MomentModule,
            SharedModule,
            NbBadgeModule, i2.NgxPermissionsModule, i3.TranslateModule, DialogsModule,
            GalleryModule,
            TableComponentsModule], exports: [ViewScreenshotsModalComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewScreenshotsModalModule, imports: [CommonModule,
            NbAlertModule,
            NbButtonModule,
            NbCardModule,
            NbDialogModule.forChild(),
            NbIconModule,
            NbProgressBarModule,
            NbTooltipModule,
            MomentModule,
            SharedModule,
            NbBadgeModule,
            NgxPermissionsModule.forChild(),
            TranslateModule.forChild(),
            DialogsModule,
            GalleryModule,
            TableComponentsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewScreenshotsModalModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ViewScreenshotsModalComponent],
                    exports: [ViewScreenshotsModalComponent],
                    imports: [
                        CommonModule,
                        NbAlertModule,
                        NbButtonModule,
                        NbCardModule,
                        NbDialogModule.forChild(),
                        NbIconModule,
                        NbProgressBarModule,
                        NbTooltipModule,
                        MomentModule,
                        SharedModule,
                        NbBadgeModule,
                        NgxPermissionsModule.forChild(),
                        TranslateModule.forChild(),
                        DialogsModule,
                        GalleryModule,
                        TableComponentsModule
                    ]
                }]
        }] });
//# sourceMappingURL=view-screenshots-modal.module.js.map