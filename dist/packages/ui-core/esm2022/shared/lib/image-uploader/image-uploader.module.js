import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageUploaderComponent } from './image-uploader.component';
import * as i0 from "@angular/core";
export class ImageUploaderModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderModule, declarations: [ImageUploaderComponent], imports: [CommonModule, FileUploadModule], exports: [ImageUploaderComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderModule, imports: [CommonModule, FileUploadModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FileUploadModule],
                    exports: [ImageUploaderComponent],
                    declarations: [ImageUploaderComponent]
                }]
        }] });
//# sourceMappingURL=image-uploader.module.js.map