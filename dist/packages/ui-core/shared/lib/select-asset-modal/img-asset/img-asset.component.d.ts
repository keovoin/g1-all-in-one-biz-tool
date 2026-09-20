import { EventEmitter, OnInit } from '@angular/core';
import { IImageAsset } from '@gauzy/contracts';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ImageAssetService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class NgxImageAssetComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly imageAssetService;
    private readonly dialogService;
    private readonly toastrService;
    imageAsset: IImageAsset;
    selectedImages: IImageAsset[];
    deleteImageEnabled: boolean;
    imageClicked: EventEmitter<any>;
    assetDeleted: EventEmitter<any>;
    ngOnInit(): void;
    constructor(translateService: TranslateService, imageAssetService: ImageAssetService, dialogService: NbDialogService, toastrService: NbToastrService);
    get selected(): IImageAsset;
    onImageClick($event: any): void;
    onDeleteAsset($event: any): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxImageAssetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxImageAssetComponent, "ngx-img-asset", never, { "imageAsset": { "alias": "imageAsset"; "required": false; }; "selectedImages": { "alias": "selectedImages"; "required": false; }; "deleteImageEnabled": { "alias": "deleteImageEnabled"; "required": false; }; }, { "imageClicked": "imageClicked"; "assetDeleted": "assetDeleted"; }, never, never, false, never>;
}
