import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileUploader } from 'ng2-file-upload';
import { filter, tap } from 'rxjs/operators';
import { environment } from '@gauzy/ui-config';
import { API_PREFIX, distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/common";
import * as i3 from "ng2-file-upload";
let ImageUploaderComponent = class ImageUploaderComponent {
    get styles() {
        return this._styles;
    }
    set styles(styles) {
        this._styles = styles;
    }
    get folder() {
        return this._folder;
    }
    set folder(value) {
        this._folder = value;
    }
    constructor(store) {
        this.store = store;
        /*
         * Getter & Setter for dynamic file uploader style element
         */
        this._styles = {
            width: '100%',
            opacity: '0',
            position: 'absolute',
            zIndex: 3,
            cursor: 'pointer'
        };
        /*
         * Getter & Setter for dynamic image upload folder
         */
        this._folder = 'profile_pictures';
        this.changeHoverState = new EventEmitter();
        this.uploadedImageAsset = new EventEmitter();
        this.uploadImageAssetError = new EventEmitter();
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
        this.store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap(() => this._loadUploaderSettings()), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        if (!this.uploader) {
            return;
        }
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.uploader.onSuccessItem = (item, response, status) => {
            try {
                if (response) {
                    const image = JSON.parse(response);
                    this.uploadedImageAsset.emit(image);
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
                    this.uploadImageAssetError.emit(error);
                }
            }
            catch (error) {
                console.log('Error while uploaded image url error', error);
            }
        };
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
     * Load settings for the file uploader, including headers and additional form data.
     *
     * @returns void
     */
    _loadUploaderSettings() {
        if (!this.user) {
            return;
        }
        const token = this.store.token;
        const tenantId = this.user.tenantId;
        const headers = [];
        headers.push({ name: 'Authorization', value: `Bearer ${token}` });
        headers.push({ name: 'Tenant-Id', value: tenantId });
        if (!!this.organization) {
            headers.push({ name: 'Organization-Id', value: `${this.organization.id}` });
        }
        const uploaderOptions = {
            url: environment.API_BASE_URL + `${API_PREFIX}/image-assets/upload/${this.folder}`,
            method: 'POST', // XHR request method
            autoUpload: true, // Upload files automatically upon addition to upload queue
            isHTML5: true, // Use xhrTransport in favor of iframeTransport
            removeAfterUpload: true, // Calculate progress independently for each uploaded file
            headers: headers // XHR request headers
        };
        this.uploader = new FileUploader(uploaderOptions);
        // Adding additional form data
        this.uploader.onBuildItemForm = (fileItem, form) => {
            if (!!this.store.user.tenantId) {
                form.append('tenantId', tenantId);
            }
            if (!!this.organization) {
                form.append('organizationId', this.organization.id);
            }
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ImageUploaderComponent, isStandalone: false, selector: "ngx-image-uploader", inputs: { styles: "styles", folder: "folder" }, outputs: { changeHoverState: "changeHoverState", uploadedImageAsset: "uploadedImageAsset", uploadImageAssetError: "uploadImageAssetError" }, ngImport: i0, template: `
		<input
			type="file"
			accept="image/*"
			aria-label="Upload image"
			(change)="imageUploadHandler()"
			(mouseenter)="changeHoverState.emit(true)"
			(mouseleave)="changeHoverState.emit(false)"
			ng2FileSelect
			[ngStyle]="styles"
			[uploader]="uploader"
		/>
	`, isInline: true, styles: ["input{height:100%!important}\n"], dependencies: [{ kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.FileSelectDirective, selector: "[ng2FileSelect]", inputs: ["uploader"], outputs: ["onFileSelected"] }] }); }
};
ImageUploaderComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [Store])
], ImageUploaderComponent);
export { ImageUploaderComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-image-uploader', template: `
		<input
			type="file"
			accept="image/*"
			aria-label="Upload image"
			(change)="imageUploadHandler()"
			(mouseenter)="changeHoverState.emit(true)"
			(mouseleave)="changeHoverState.emit(false)"
			ng2FileSelect
			[ngStyle]="styles"
			[uploader]="uploader"
		/>
	`, standalone: false, styles: ["input{height:100%!important}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { styles: [{
                type: Input
            }], folder: [{
                type: Input
            }], changeHoverState: [{
                type: Output
            }], uploadedImageAsset: [{
                type: Output
            }], uploadImageAssetError: [{
                type: Output
            }] } });
//# sourceMappingURL=image-uploader.component.js.map