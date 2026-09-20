import { OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ProductTypesIconsEnum, LanguagesEnum, IProductTypeTranslation, IProductTypeTranslatable, IOrganization } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ProductTypeService, Store, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProductTypeMutationComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly dialogRef: NbDialogRef<IProductTypeTranslatable>;
    readonly translationService: TranslateService;
    private readonly fb;
    private readonly productTypeService;
    private readonly store;
    private readonly toastrService;
    productType: IProductTypeTranslatable;
    icons: ProductTypesIconsEnum[];
    selectedLanguage: LanguagesEnum;
    activeTranslation: IProductTypeTranslation;
    translations: any;
    organization: IOrganization;
    readonly form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<IProductTypeTranslatable>, translationService: TranslateService, fb: UntypedFormBuilder, productTypeService: ProductTypeService, store: Store, toastrService: ToastrService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onSubmit(): Promise<void>;
    closeDialog(productType?: IProductTypeTranslatable): Promise<void>;
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductTypeMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProductTypeMutationComponent, "ngx-product-type-mutation", never, { "productType": { "alias": "productType"; "required": false; }; }, {}, never, never, false, never>;
}
