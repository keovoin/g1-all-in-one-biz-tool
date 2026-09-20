import { Component, Input } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../file-uploader-input/file-uploader-input.component";
import * as i3 from "@ngx-translate/core";
export class CandidateCvComponent {
    constructor(fb) {
        this.fb = fb;
        this.loadFormData = () => {
            this.form = this.fb.group({
                cvUrl: [
                    '',
                    Validators.compose([
                        Validators.pattern(new RegExp(`(http)?s?:?(\/\/[^"']*\.(?:doc|docx|pdf|))`, 'g'))
                    ])
                ]
            });
            this.cvUrl = this.form.get('cvUrl');
        };
    }
    ngOnInit() {
        this.loadFormData();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCvComponent, deps: [{ token: i1.UntypedFormBuilder }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CandidateCvComponent, isStandalone: false, selector: "ga-candidate-cv", inputs: { documentUrl: "documentUrl", isDocument: "isDocument" }, ngImport: i0, template: "<div class=\"row\">\n\t<div class=\"col-sm-12\">\n\t\t<div class=\"form-group\">\n\t\t\t<ngx-file-uploader-input\n\t\t\t\tid=\"inputCvUrl\"\n\t\t\t\t[placeholder]=\"\n\t\t\t\t\t'FORM.PLACEHOLDERS.UPLOADER_DOCUMENT_PLACEHOLDER'\n\t\t\t\t\t\t| translate\n\t\t\t\t\"\n\t\t\t\t[fileUrl]=\"isDocument ? documentUrl : cvUrl.value\"\n\t\t\t\t(uploadedImgUrl)=\"cvUrl.setValue($event)\"\n\t\t\t></ngx-file-uploader-input>\n\t\t</div>\n\t</div>\n</div>\n", dependencies: [{ kind: "component", type: i2.FileUploaderInputComponent, selector: "ngx-file-uploader-input", inputs: ["placeholder", "locale", "fileUrl"], outputs: ["uploadedImageAsset", "uploadedImgUrl", "uploadedImgData"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCvComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-cv', standalone: false, template: "<div class=\"row\">\n\t<div class=\"col-sm-12\">\n\t\t<div class=\"form-group\">\n\t\t\t<ngx-file-uploader-input\n\t\t\t\tid=\"inputCvUrl\"\n\t\t\t\t[placeholder]=\"\n\t\t\t\t\t'FORM.PLACEHOLDERS.UPLOADER_DOCUMENT_PLACEHOLDER'\n\t\t\t\t\t\t| translate\n\t\t\t\t\"\n\t\t\t\t[fileUrl]=\"isDocument ? documentUrl : cvUrl.value\"\n\t\t\t\t(uploadedImgUrl)=\"cvUrl.setValue($event)\"\n\t\t\t></ngx-file-uploader-input>\n\t\t</div>\n\t</div>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }], propDecorators: { documentUrl: [{
                type: Input
            }], isDocument: [{
                type: Input
            }] } });
//# sourceMappingURL=candidate-cv.component.js.map