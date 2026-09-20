import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationsService, ProductCategoryService, ProductService, ProductTypeService, ProductVariantPriceService, ProductVariantService, ProductVariantSettingService } from '@gauzy/ui-core/core';
import { LanguageSelectorModule } from '../../language/language-selector/language-selector.module';
import { ImageUploaderModule } from '../../image-uploader/image-uploader.module';
import { ProductTypeMutationComponent } from './product-type-mutation/product-type-mutation.component';
import { ProductCategoryMutationComponent } from './product-category-mutation/product-category-mutation.component';
import { ProductOptionGroupTranslationsComponent } from './product-option-group-translation/product-option-group-translation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProductMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProductMutationModule, declarations: [ProductTypeMutationComponent,
            ProductCategoryMutationComponent,
            ProductOptionGroupTranslationsComponent], imports: [NbButtonModule,
            NbInputModule,
            NbCardModule,
            CommonModule,
            NbIconModule, i1.TranslateModule, LanguageSelectorModule,
            ImageUploaderModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductMutationModule, providers: [
            ProductTypeService,
            ProductCategoryService,
            ProductService,
            ProductVariantService,
            ProductVariantSettingService,
            ProductVariantPriceService,
            OrganizationsService
        ], imports: [NbButtonModule,
            NbInputModule,
            NbCardModule,
            CommonModule,
            NbIconModule,
            TranslateModule.forChild(),
            LanguageSelectorModule,
            ImageUploaderModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        ProductTypeMutationComponent,
                        ProductCategoryMutationComponent,
                        ProductOptionGroupTranslationsComponent
                    ],
                    imports: [
                        NbButtonModule,
                        NbInputModule,
                        NbCardModule,
                        CommonModule,
                        NbIconModule,
                        TranslateModule.forChild(),
                        LanguageSelectorModule,
                        ImageUploaderModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NgSelectModule
                    ],
                    providers: [
                        ProductTypeService,
                        ProductCategoryService,
                        ProductService,
                        ProductVariantService,
                        ProductVariantSettingService,
                        ProductVariantPriceService,
                        OrganizationsService
                    ]
                }]
        }] });
//# sourceMappingURL=product-mutation.module.js.map