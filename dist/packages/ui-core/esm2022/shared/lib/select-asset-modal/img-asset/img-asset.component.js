import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ImageAssetService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DeleteConfirmationComponent } from '../../user/forms/delete-confirmation/delete-confirmation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
export class NgxImageAssetComponent extends TranslationBaseComponent {
    ngOnInit() { }
    constructor(translateService, imageAssetService, dialogService, toastrService) {
        super(translateService);
        this.translateService = translateService;
        this.imageAssetService = imageAssetService;
        this.dialogService = dialogService;
        this.toastrService = toastrService;
        this.selectedImages = [];
        this.imageClicked = new EventEmitter();
        this.assetDeleted = new EventEmitter();
    }
    get selected() {
        if (!this.imageAsset || !this.selectedImages)
            return;
        return this.selectedImages.find((image) => image.fullUrl == this.imageAsset.fullUrl);
    }
    onImageClick($event) {
        this.imageClicked.emit(this.imageAsset);
    }
    async onDeleteAsset($event) {
        const result = await firstValueFrom(this.dialogService.open(DeleteConfirmationComponent).onClose);
        if (result) {
            await this.imageAssetService
                .deleteImageAsset(this.imageAsset)
                .then(() => {
                this.toastrService.success(this.getTranslation('INVENTORY_PAGE.IMAGE_ASSET_DELETED'), this.imageAsset.name);
                this.assetDeleted.emit(this.imageAsset);
            })
                .catch((err) => {
                this.toastrService.danger(err.error.message || 'Could not delete image', 'Error');
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NgxImageAssetComponent, deps: [{ token: i1.TranslateService }, { token: i2.ImageAssetService }, { token: i3.NbDialogService }, { token: i3.NbToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: NgxImageAssetComponent, isStandalone: false, selector: "ngx-img-asset", inputs: { imageAsset: "imageAsset", selectedImages: "selectedImages", deleteImageEnabled: "deleteImageEnabled" }, outputs: { imageClicked: "imageClicked", assetDeleted: "assetDeleted" }, usesInheritance: true, ngImport: i0, template: "<div class=\"image-asset-list-item\" (click)=\"onImageClick($event)\" [class.selected]=\"selected\">\n\t@if (deleteImageEnabled) {\n\t<div class=\"delete-asset-btn\" (click)=\"onDeleteAsset($event)\">\n\t\t<nb-icon icon=\"trash-outline\"></nb-icon>\n\t</div>\n\t}\n\t<div class=\"image-item\" [style.backgroundImage]=\"'url(' + imageAsset.fullUrl + ')'\"></div>\n</div>\n", styles: [".image-item{height:100px;width:100%;padding-bottom:100%;background-position:center;background-repeat:no-repeat;background-size:cover;border-radius:var(--border-radius)}.image-asset-list-item{border-radius:var(--border-radius);transition:.1s all ease-in-out;cursor:pointer;position:relative}.image-asset-list-item:hover{box-shadow:var(--gauzy-shadow)}.image-asset-list-item:hover .delete-asset-btn{opacity:1}.image-asset-list-item.selected{box-shadow:var(--gauzy-shadow)}.delete-asset-btn{position:absolute;width:32px;height:32px;top:4px;left:4px;background:#fff;border-radius:50%;display:flex;justify-content:center;align-items:center;cursor:pointer;opacity:0;box-shadow:var(--gauzy-shadow);color:var(--text-danger-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NgxImageAssetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-img-asset', standalone: false, template: "<div class=\"image-asset-list-item\" (click)=\"onImageClick($event)\" [class.selected]=\"selected\">\n\t@if (deleteImageEnabled) {\n\t<div class=\"delete-asset-btn\" (click)=\"onDeleteAsset($event)\">\n\t\t<nb-icon icon=\"trash-outline\"></nb-icon>\n\t</div>\n\t}\n\t<div class=\"image-item\" [style.backgroundImage]=\"'url(' + imageAsset.fullUrl + ')'\"></div>\n</div>\n", styles: [".image-item{height:100px;width:100%;padding-bottom:100%;background-position:center;background-repeat:no-repeat;background-size:cover;border-radius:var(--border-radius)}.image-asset-list-item{border-radius:var(--border-radius);transition:.1s all ease-in-out;cursor:pointer;position:relative}.image-asset-list-item:hover{box-shadow:var(--gauzy-shadow)}.image-asset-list-item:hover .delete-asset-btn{opacity:1}.image-asset-list-item.selected{box-shadow:var(--gauzy-shadow)}.delete-asset-btn{position:absolute;width:32px;height:32px;top:4px;left:4px;background:#fff;border-radius:50%;display:flex;justify-content:center;align-items:center;cursor:pointer;opacity:0;box-shadow:var(--gauzy-shadow);color:var(--text-danger-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ImageAssetService }, { type: i3.NbDialogService }, { type: i3.NbToastrService }], propDecorators: { imageAsset: [{
                type: Input
            }], selectedImages: [{
                type: Input
            }], deleteImageEnabled: [{
                type: Input
            }], imageClicked: [{
                type: Output
            }], assetDeleted: [{
                type: Output
            }] } });
//# sourceMappingURL=img-asset.component.js.map