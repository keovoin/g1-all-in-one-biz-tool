import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbToastrModule, NbDialogModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ImageAssetService } from '@gauzy/ui-core/core';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';
import { FileUploaderModule } from '../file-uploader-input/file-uploader-input.module';
import { NgxImageAssetComponent } from './img-asset/img-asset.component';
import { ImagePreviewComponent } from './img-preview/img-preview.component';
import { SelectAssetComponent } from './select-asset.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class SelectAssetModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectAssetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SelectAssetModule, declarations: [SelectAssetComponent, NgxImageAssetComponent, ImagePreviewComponent], imports: [CommonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbButtonModule, i1.TranslateModule, NbToastrModule,
            ImageUploaderModule,
            FileUploaderModule,
            NbToastrModule,
            NbDialogModule,
            NbSpinnerModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectAssetModule, providers: [ImageAssetService], imports: [CommonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbButtonModule,
            TranslateModule.forChild(),
            NbToastrModule,
            ImageUploaderModule,
            FileUploaderModule,
            NbToastrModule,
            NbDialogModule,
            NbSpinnerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectAssetModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SelectAssetComponent, NgxImageAssetComponent, ImagePreviewComponent],
                    imports: [
                        CommonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbButtonModule,
                        TranslateModule.forChild(),
                        NbToastrModule,
                        ImageUploaderModule,
                        FileUploaderModule,
                        NbToastrModule,
                        NbDialogModule,
                        NbSpinnerModule
                    ],
                    providers: [ImageAssetService]
                }]
        }] });
//# sourceMappingURL=select-asset.module.js.map