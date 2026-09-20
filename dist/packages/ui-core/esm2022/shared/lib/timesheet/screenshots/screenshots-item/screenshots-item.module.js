import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbDialogModule, NbIconModule, NbCheckboxModule, NbProgressBarModule, NbPopoverModule, NbListModule, NbTooltipModule } from '@nebular/theme';
import { MomentModule } from 'ngx-moment';
import { TranslateModule } from '@ngx-translate/core';
import { DialogsModule } from '../../../dialogs/dialogs.module';
import { TableComponentsModule } from '../../../table-components';
import { GalleryModule } from '../../../gallery/gallery.module';
import { ViewScreenshotsModalModule } from '../view-screenshots-modal/view-screenshots-modal.module';
import { SharedModule } from '../../../shared.module';
import { ScreenshotsItemComponent } from './screenshots-item.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class ScreenshotsItemModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ScreenshotsItemModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ScreenshotsItemModule, declarations: [ScreenshotsItemComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCheckboxModule, i1.NbDialogModule, NbIconModule,
            NbListModule,
            NbPopoverModule,
            NbProgressBarModule,
            NbTooltipModule,
            MomentModule, i2.TranslateModule, SharedModule,
            DialogsModule,
            GalleryModule,
            TableComponentsModule,
            ViewScreenshotsModalModule], exports: [ScreenshotsItemComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ScreenshotsItemModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCheckboxModule,
            NbDialogModule.forChild(),
            NbIconModule,
            NbListModule,
            NbPopoverModule,
            NbProgressBarModule,
            NbTooltipModule,
            MomentModule,
            TranslateModule.forChild(),
            SharedModule,
            DialogsModule,
            GalleryModule,
            TableComponentsModule,
            ViewScreenshotsModalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ScreenshotsItemModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ScreenshotsItemComponent],
                    exports: [ScreenshotsItemComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCheckboxModule,
                        NbDialogModule.forChild(),
                        NbIconModule,
                        NbListModule,
                        NbPopoverModule,
                        NbProgressBarModule,
                        NbTooltipModule,
                        MomentModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        DialogsModule,
                        GalleryModule,
                        TableComponentsModule,
                        ViewScreenshotsModalModule
                    ]
                }]
        }] });
//# sourceMappingURL=screenshots-item.module.js.map