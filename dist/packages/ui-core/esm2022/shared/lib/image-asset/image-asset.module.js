import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ImageAssetComponent } from './image-asset.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ImageAssetModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageAssetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ImageAssetModule, declarations: [ImageAssetComponent], imports: [CommonModule,
            NbButtonModule,
            NbCardModule,
            NbInputModule, i1.TranslateModule, FormsModule,
            ReactiveFormsModule], exports: [ImageAssetComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageAssetModule, imports: [CommonModule,
            NbButtonModule,
            NbCardModule,
            NbInputModule,
            TranslateModule.forChild(),
            FormsModule,
            ReactiveFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageAssetModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbCardModule,
                        NbInputModule,
                        TranslateModule.forChild(),
                        FormsModule,
                        ReactiveFormsModule
                    ],
                    declarations: [ImageAssetComponent],
                    exports: [ImageAssetComponent]
                }]
        }] });
//# sourceMappingURL=image-asset.module.js.map