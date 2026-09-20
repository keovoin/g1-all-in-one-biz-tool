import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@gauzy/ui-core/core';
import { ImageUploaderBaseComponent } from '../image-uploader/image-uploader-base.component';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "../directives/debounce-click.directive";
import * as i5 from "ng2-file-upload";
import * as i6 from "@angular/common";
import * as i7 from "@ngx-translate/core";
export class FileUploaderInputComponent extends ImageUploaderBaseComponent {
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get locale() {
        return this._locale;
    }
    set locale(value) {
        this._locale = value;
    }
    get fileUrl() {
        return this._fileUrl;
    }
    set fileUrl(fileUrl) {
        this._fileUrl = fileUrl;
        this.inputControl.setValue(fileUrl);
        this.inputControl.updateValueAndValidity();
    }
    constructor(store) {
        super(store);
        this.store = store;
        this.inputControl = new FormControl();
        this.loading = false;
        this.uploadedImageAsset = new EventEmitter();
        this.uploadedImgUrl = new EventEmitter();
        this.uploadedImgData = new EventEmitter();
    }
    ngOnInit() { }
    ngAfterViewInit() {
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.uploader.onSuccessItem = (item, response, status) => {
            try {
                if (response) {
                    const image = JSON.parse(response);
                    this.uploadedImageAsset.emit(image);
                    this.uploadedImgData.emit(image);
                    this.inputControl.setValue(image.fullUrl);
                    this.inputControl.updateValueAndValidity();
                }
            }
            catch (error) {
                console.log('Error while uploaded image url', error);
            }
        };
        this.uploader.onErrorItem = (item, response, status) => {
            try {
                if (response) {
                    const error = JSON.parse(response);
                    console.log(error);
                }
            }
            catch (error) {
                console.log('Error while uploaded image url error', error);
            }
        };
    }
    /**
     * When input changed file URL
     *
     * @param event
     */
    async inputUrlChanged() {
        const fileUrl = this.inputControl.value;
        if (fileUrl) {
            try {
                await this._setupImage(fileUrl);
                this.uploadedImgUrl.emit(fileUrl);
            }
            catch (error) {
                console.log('Error while retrieving image from URL', error);
            }
        }
    }
    /**
     * Image asset upload handler
     */
    imageUploadHandler() {
        if (this.uploader.queue.length > 0) {
            this.uploader.queue[this.uploader.queue.length - 1].upload();
        }
    }
    /**
     * Get image metadata and setup image object
     *
     * @param imgUrl
     * @returns
     */
    async _setupImage(imgUrl) {
        try {
            const img = await this.getImageMetadata(imgUrl);
            const width = img['width'];
            const height = img['height'];
            const orientation = width !== height ? (width > height ? 2 : 1) : 0;
            const locale = this.locale;
            const url = imgUrl;
            return {
                locale,
                url,
                width,
                height,
                orientation
            };
        }
        catch (error) {
            return error;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileUploaderInputComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: FileUploaderInputComponent, isStandalone: false, selector: "ngx-file-uploader-input", inputs: { placeholder: "placeholder", locale: "locale", fileUrl: "fileUrl" }, outputs: { uploadedImageAsset: "uploadedImageAsset", uploadedImgUrl: "uploadedImgUrl", uploadedImgData: "uploadedImgData" }, usesInheritance: true, ngImport: i0, template: "<div nbSpinnerStatus=\"primary\" class=\"file-uploader-container\">\n\t<input\n\t\ttype=\"text\"\n\t\tclass=\"form-control\"\n\t\t[placeholder]=\"placeholder\"\n\t\t[formControl]=\"inputControl\"\n\t\t(change)=\"inputUrlChanged()\"\n\t/>\n\t<input\n\t\t#fileInput\n\t\ttype=\"file\"\n\t\tid=\"fileInput\"\n\t\tng2FileSelect\n\t\t(change)=\"imageUploadHandler()\"\n\t\t[hidden]=\"true\"\n\t\t[uploader]=\"uploader\"\n\t/>\n\t<button\n\t\tnbButton\n\t\tstatus=\"primary\"\n\t\toutline\n\t\tsize=\"tiny\"\n\t\tdebounceClick\n\t\t(throttledClick)=\"fileInput.click()\"\n\t>\n\t\t<i class=\"far fa-folder mr-1\"></i>\n\t\t<span class=\"text\">\n\t\t\t{{ 'BROWSE' | translate | titlecase }}\n\t\t</span>\n\t</button>\n</div>\n", styles: [".file-uploader-container{padding:0;position:relative;border-radius:nb-theme(border-radius)}.file-uploader-container button{position:absolute;right:8px;top:calc(50% - 12px);height:24px;border-width:2px;border-color:nb-theme(color-primary-transparent-default)}.file-uploader-container input{padding-right:6.25rem;border-radius:nb-theme(border-radius)}.file-uploader-container .text{font-size:12px;font-weight:400;line-height:16px;letter-spacing:-.009em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i4.DebounceClickDirective, selector: "[debounceClick]", inputs: ["debounceTime"], outputs: ["throttledClick"] }, { kind: "directive", type: i5.FileSelectDirective, selector: "[ng2FileSelect]", inputs: ["uploader"], outputs: ["onFileSelected"] }, { kind: "pipe", type: i6.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i7.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileUploaderInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-file-uploader-input', standalone: false, template: "<div nbSpinnerStatus=\"primary\" class=\"file-uploader-container\">\n\t<input\n\t\ttype=\"text\"\n\t\tclass=\"form-control\"\n\t\t[placeholder]=\"placeholder\"\n\t\t[formControl]=\"inputControl\"\n\t\t(change)=\"inputUrlChanged()\"\n\t/>\n\t<input\n\t\t#fileInput\n\t\ttype=\"file\"\n\t\tid=\"fileInput\"\n\t\tng2FileSelect\n\t\t(change)=\"imageUploadHandler()\"\n\t\t[hidden]=\"true\"\n\t\t[uploader]=\"uploader\"\n\t/>\n\t<button\n\t\tnbButton\n\t\tstatus=\"primary\"\n\t\toutline\n\t\tsize=\"tiny\"\n\t\tdebounceClick\n\t\t(throttledClick)=\"fileInput.click()\"\n\t>\n\t\t<i class=\"far fa-folder mr-1\"></i>\n\t\t<span class=\"text\">\n\t\t\t{{ 'BROWSE' | translate | titlecase }}\n\t\t</span>\n\t</button>\n</div>\n", styles: [".file-uploader-container{padding:0;position:relative;border-radius:nb-theme(border-radius)}.file-uploader-container button{position:absolute;right:8px;top:calc(50% - 12px);height:24px;border-width:2px;border-color:nb-theme(color-primary-transparent-default)}.file-uploader-container input{padding-right:6.25rem;border-radius:nb-theme(border-radius)}.file-uploader-container .text{font-size:12px;font-weight:400;line-height:16px;letter-spacing:-.009em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { placeholder: [{
                type: Input
            }], locale: [{
                type: Input
            }], fileUrl: [{
                type: Input
            }], uploadedImageAsset: [{
                type: Output
            }], uploadedImgUrl: [{
                type: Output
            }], uploadedImgData: [{
                type: Output
            }] } });
//# sourceMappingURL=file-uploader-input.component.js.map