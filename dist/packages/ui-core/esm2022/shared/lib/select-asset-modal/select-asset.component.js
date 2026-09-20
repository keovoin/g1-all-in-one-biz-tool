import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { ImageAssetService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "../file-uploader-input/file-uploader-input.component";
import * as i5 from "./img-asset/img-asset.component";
import * as i6 from "./img-preview/img-preview.component";
let SelectAssetComponent = class SelectAssetComponent extends TranslationBaseComponent {
    constructor(dialogRef, translationService, imageAssetService, store) {
        super(translationService);
        this.dialogRef = dialogRef;
        this.translationService = translationService;
        this.imageAssetService = imageAssetService;
        this.store = store;
        this.selectedImages = [];
        this.loading = true;
        this.gallery = [];
        this.settings = {
            uploadImageEnabled: true,
            deleteImageEnabled: true,
            selectMultiple: false
        };
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.getAvailableImages()), untilDestroyed(this))
            .subscribe();
        this.setImageStoredEvent();
    }
    async getAvailableImages() {
        if (this.galleryInput) {
            this.gallery = this.galleryInput;
            this.loading = false;
            return;
        }
        const { id: organizationId } = this.organization;
        const { tenantId } = this.store.user;
        await this.imageAssetService
            .getAll({ tenantId, organizationId })
            .then(({ items }) => {
            this.gallery = items;
        })
            .finally(() => {
            this.loading = false;
        });
    }
    onSelectImage(selectedImage) {
        this.activeImage = selectedImage;
        switch (this.settings.selectMultiple) {
            case true:
                let find = this.selectedImages.find((el) => el.id === selectedImage.id);
                if (find) {
                    this.selectedImages = this.selectedImages.filter((image) => image.id !== selectedImage.id);
                }
                else {
                    this.selectedImages.push(selectedImage);
                }
                break;
            case false:
                this.selectedImages[0] = selectedImage;
                break;
        }
    }
    onSelectImageClick() {
        if (this.settings.selectMultiple) {
            this.dialogRef.close(this.selectedImages);
        }
        else {
            this.dialogRef.close(this.selectedImages[0]);
        }
    }
    onImageUploaded(image) {
        this.gallery.push(image); // Add the uploaded image to the gallery immediately
        this.activeImage = image; // Set the uploaded image as the active one
    }
    onImageAssetDeleted(imageDeleted) {
        this.gallery = this.gallery.filter((image) => image.id != imageDeleted.id);
    }
    setImageStoredEvent() {
        if (!this.newImageStoredEvent)
            return;
        this.newImageStoredEvent
            .pipe(tap((image) => this.gallery.push(image)), untilDestroyed(this))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectAssetComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TranslateService }, { token: i3.ImageAssetService }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SelectAssetComponent, isStandalone: false, selector: "ngx-select-asset", inputs: { settings: "settings", galleryInput: "galleryInput", newImageUploadedEvent: "newImageUploadedEvent", newImageStoredEvent: "newImageStoredEvent" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\" size=\"large\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"> <i class=\"fas fa-times\" (click)=\"dialogRef.close()\"></i> </span>\n    <h5 class=\"title\">\n      {{ 'INVENTORY_PAGE.SELECT_OR_UPLOAD_IMAGE' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <div class=\"row\">\n      <div class=\"col-md-8\">\n        @if (settings.uploadImageEnabled) {\n          <div class=\"mb-3\">\n            <ngx-file-uploader-input\n              class=\"browse-image\"\n              id=\"inputImageUrl\"\n              [placeholder]=\"'upload image'\"\n              (uploadedImgData)=\"onImageUploaded($event)\"\n            ></ngx-file-uploader-input>\n            <!-- <button class=\"button-import\" outline status=\"primary\" size=\"medium\" nbButton>\n            {{ 'INVENTORY_PAGE.BROWSE' | translate }}\n          </button> -->\n        </div>\n      }\n      <div class=\"row image-assets-container\">\n        @for (image of gallery; track image) {\n          <div class=\"col-lg-3 col-md-4 col-sm-6 mb-3 image-item\">\n            <ngx-img-asset\n              [imageAsset]=\"image\"\n              [selectedImages]=\"selectedImages\"\n              [deleteImageEnabled]=\"settings.deleteImageEnabled\"\n              (imageClicked)=\"onSelectImage($event)\"\n              (assetDeleted)=\"onImageAssetDeleted($event)\"\n            ></ngx-img-asset>\n          </div>\n        }\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row pl-3\">\n        <ngx-img-preview [selectedImage]=\"activeImage\"></ngx-img-preview>\n      </div>\n    </div>\n  </div>\n</nb-card-body>\n<nb-card-footer>\n  <button class=\"primary button-home\" status=\"primary\" nbButton nbStepperNext (click)=\"onSelectImageClick()\">\n    {{ 'INVENTORY_PAGE.SELECT_IMAGE' | translate }}\n  </button>\n</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}nb-card{width:950px;max-width:90vw}nb-card-body{overflow-y:unset}.image-assets-container{height:350px;max-height:100%;overflow-y:auto}.browse-image{width:100%}ngx-img-preview{width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.FileUploaderInputComponent, selector: "ngx-file-uploader-input", inputs: ["placeholder", "locale", "fileUrl"], outputs: ["uploadedImageAsset", "uploadedImgUrl", "uploadedImgData"] }, { kind: "directive", type: i1.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i5.NgxImageAssetComponent, selector: "ngx-img-asset", inputs: ["imageAsset", "selectedImages", "deleteImageEnabled"], outputs: ["imageClicked", "assetDeleted"] }, { kind: "component", type: i6.ImagePreviewComponent, selector: "ngx-img-preview", inputs: ["selectedImage"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
SelectAssetComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [NbDialogRef,
        TranslateService,
        ImageAssetService,
        Store])
], SelectAssetComponent);
export { SelectAssetComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectAssetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-select-asset', standalone: false, template: "<nb-card class=\"main\" size=\"large\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"> <i class=\"fas fa-times\" (click)=\"dialogRef.close()\"></i> </span>\n    <h5 class=\"title\">\n      {{ 'INVENTORY_PAGE.SELECT_OR_UPLOAD_IMAGE' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <div class=\"row\">\n      <div class=\"col-md-8\">\n        @if (settings.uploadImageEnabled) {\n          <div class=\"mb-3\">\n            <ngx-file-uploader-input\n              class=\"browse-image\"\n              id=\"inputImageUrl\"\n              [placeholder]=\"'upload image'\"\n              (uploadedImgData)=\"onImageUploaded($event)\"\n            ></ngx-file-uploader-input>\n            <!-- <button class=\"button-import\" outline status=\"primary\" size=\"medium\" nbButton>\n            {{ 'INVENTORY_PAGE.BROWSE' | translate }}\n          </button> -->\n        </div>\n      }\n      <div class=\"row image-assets-container\">\n        @for (image of gallery; track image) {\n          <div class=\"col-lg-3 col-md-4 col-sm-6 mb-3 image-item\">\n            <ngx-img-asset\n              [imageAsset]=\"image\"\n              [selectedImages]=\"selectedImages\"\n              [deleteImageEnabled]=\"settings.deleteImageEnabled\"\n              (imageClicked)=\"onSelectImage($event)\"\n              (assetDeleted)=\"onImageAssetDeleted($event)\"\n            ></ngx-img-asset>\n          </div>\n        }\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row pl-3\">\n        <ngx-img-preview [selectedImage]=\"activeImage\"></ngx-img-preview>\n      </div>\n    </div>\n  </div>\n</nb-card-body>\n<nb-card-footer>\n  <button class=\"primary button-home\" status=\"primary\" nbButton nbStepperNext (click)=\"onSelectImageClick()\">\n    {{ 'INVENTORY_PAGE.SELECT_IMAGE' | translate }}\n  </button>\n</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}nb-card{width:950px;max-width:90vw}nb-card-body{overflow-y:unset}.image-assets-container{height:350px;max-height:100%;overflow-y:auto}.browse-image{width:100%}ngx-img-preview{width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TranslateService }, { type: i3.ImageAssetService }, { type: i3.Store }], propDecorators: { settings: [{
                type: Input
            }], galleryInput: [{
                type: Input
            }], newImageUploadedEvent: [{
                type: Input
            }], newImageStoredEvent: [{
                type: Input
            }] } });
//# sourceMappingURL=select-asset.component.js.map