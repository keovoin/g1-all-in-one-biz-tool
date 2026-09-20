import { OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { IImageAsset, IOrganization, IProductCategoryTranslatable, IProductCategoryTranslation, LanguagesEnum } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ProductCategoryService, Store, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProductCategoryMutationComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly dialogRef: NbDialogRef<IProductCategoryTranslatable>;
    readonly translationService: TranslateService;
    private readonly fb;
    private readonly productCategoryService;
    private readonly store;
    private readonly toastrService;
    productCategory: IProductCategoryTranslatable;
    hoverState: boolean;
    selectedLanguage: LanguagesEnum;
    activeTranslation: IProductCategoryTranslation;
    organization: IOrganization;
    translations: any;
    readonly form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<IProductCategoryTranslatable>, translationService: TranslateService, fb: UntypedFormBuilder, productCategoryService: ProductCategoryService, store: Store, toastrService: ToastrService);
    ngOnInit(): void;
    onSubmit(): Promise<void>;
    closeDialog(productCategory?: IProductCategoryTranslatable): Promise<void>;
    /**
     * PATCH product category old raw value
     *
     * @returns
     */
    private _patchRawValue;
    /**
     * SET selected language active translation
     *
     * @returns
     */
    private _setActiveTranslation;
    /**
     * SET product category all translations
     */
    private _setTranslationsRawValue;
    /**
     * On language change set active translation
     *
     * @param langCode
     */
    onLangChange(langCode: LanguagesEnum): void;
    /**
     * Upload product category image
     *
     * @param image
     */
    updateImageAsset(image: IImageAsset): void;
    handleImageUploadError(error: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductCategoryMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProductCategoryMutationComponent, "ngx-product-category-mutation", never, { "productCategory": { "alias": "productCategory"; "required": false; }; }, {}, never, never, false, never>;
}
