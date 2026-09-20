import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileUploader } from 'ng2-file-upload';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { environment } from '@gauzy/ui-config';
import { API_PREFIX, distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
let ImageUploaderBaseComponent = class ImageUploaderBaseComponent {
    get folder() {
        return this._folder;
    }
    set folder(value) {
        this._folder = value;
        this.setUploaderConfigurationOptions();
    }
    constructor(store) {
        this.store = store;
        this.subject$ = new Subject();
        /*
         * Getter & Setter for dynamic image upload folder
         */
        this._folder = 'profile_pictures';
        this.onInit();
    }
    onInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
        this.store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap(() => this.setUploaderConfigurationOptions()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Set file uploader configuration options
     */
    setUploaderConfigurationOptions() {
        if (!this.user) {
            return;
        }
        const { token } = this.store;
        const { tenantId } = this.user;
        const headers = [];
        headers.push({ name: 'Authorization', value: `Bearer ${token}` });
        headers.push({ name: 'Tenant-Id', value: tenantId });
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
    /**
     * Get image metadata using by Image URL
     *
     * @param url
     * @returns
     */
    async getImageMetadata(url) {
        try {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = (error) => reject(false);
                img.src = url;
            });
        }
        catch (error) {
            console.log('Error while retrieving image metadata', error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderBaseComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ImageUploaderBaseComponent, isStandalone: false, selector: "ng-component", inputs: { folder: "folder" }, ngImport: i0, template: '', isInline: true }); }
};
ImageUploaderBaseComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store])
], ImageUploaderBaseComponent);
export { ImageUploaderBaseComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageUploaderBaseComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { folder: [{
                type: Input
            }] } });
//# sourceMappingURL=image-uploader-base.component.js.map