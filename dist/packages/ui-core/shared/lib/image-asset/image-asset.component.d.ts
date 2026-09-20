import { OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IImageAsset } from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ImageAssetService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ImageAssetComponent extends TranslationBaseComponent implements OnInit {
    private readonly fb;
    readonly translateService: TranslateService;
    private readonly imageAssetService;
    private readonly dialogRef;
    private readonly toastrService;
    form: UntypedFormGroup;
    imageAsset: IImageAsset;
    constructor(fb: UntypedFormBuilder, translateService: TranslateService, imageAssetService: ImageAssetService, dialogRef: NbDialogRef<ImageAssetComponent>, toastrService: ToastrService);
    ngOnInit(): void;
    onSaveRequest(): Promise<void>;
    onCancel(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageAssetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ImageAssetComponent, "ga-image-asset", never, { "imageAsset": { "alias": "imageAsset"; "required": false; }; }, {}, never, never, false, never>;
}
