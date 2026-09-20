import { OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';
import { IImageAsset, IOrganization } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { ImageAssetService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export interface SelectAssetSettings {
    uploadImageEnabled?: boolean;
    deleteImageEnabled?: boolean;
    selectMultiple?: boolean;
}
export declare class SelectAssetComponent extends TranslationBaseComponent implements OnInit {
    readonly dialogRef: NbDialogRef<any>;
    readonly translationService: TranslateService;
    private readonly imageAssetService;
    private readonly store;
    activeImage: IImageAsset;
    selectedImages: IImageAsset[];
    loading: boolean;
    gallery: IImageAsset[];
    settings: SelectAssetSettings;
    galleryInput: IImageAsset[];
    newImageUploadedEvent: Subject<any>;
    newImageStoredEvent: Subject<IImageAsset>;
    organization: IOrganization;
    constructor(dialogRef: NbDialogRef<any>, translationService: TranslateService, imageAssetService: ImageAssetService, store: Store);
    ngOnInit(): void;
    getAvailableImages(): Promise<void>;
    onSelectImage(selectedImage: IImageAsset): void;
    onSelectImageClick(): void;
    onImageUploaded(image: IImageAsset): void;
    onImageAssetDeleted(imageDeleted: IImageAsset): void;
    setImageStoredEvent(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectAssetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SelectAssetComponent, "ngx-select-asset", never, { "settings": { "alias": "settings"; "required": false; }; "galleryInput": { "alias": "galleryInput"; "required": false; }; "newImageUploadedEvent": { "alias": "newImageUploadedEvent"; "required": false; }; "newImageStoredEvent": { "alias": "newImageStoredEvent"; "required": false; }; }, {}, never, never, false, never>;
}
