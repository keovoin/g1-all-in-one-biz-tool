import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { FileUploadModule } from 'ng2-file-upload';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../directives/directives.module';
import { FileUploaderInputComponent } from './file-uploader-input.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class FileUploaderModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileUploaderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: FileUploaderModule, declarations: [FileUploaderInputComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbSpinnerModule, i1.TranslateModule, DirectivesModule,
            FileUploadModule], exports: [FileUploaderInputComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileUploaderModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbSpinnerModule,
            TranslateModule.forChild(),
            DirectivesModule,
            FileUploadModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileUploaderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbSpinnerModule,
                        TranslateModule.forChild(),
                        DirectivesModule,
                        FileUploadModule
                    ],
                    exports: [FileUploaderInputComponent],
                    declarations: [FileUploaderInputComponent]
                }]
        }] });
//# sourceMappingURL=file-uploader-input.module.js.map