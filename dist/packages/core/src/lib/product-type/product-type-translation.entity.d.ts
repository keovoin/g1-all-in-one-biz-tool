import { IProductTypeTranslation } from '@gauzy/contracts';
import { ProductType, TranslationBase } from '../core/entities/internal';
export declare class ProductTypeTranslation extends TranslationBase implements IProductTypeTranslation {
    name: string;
    description: string;
    languageCode: string;
    /**
     * ProductType
     */
    reference: ProductType;
    referenceId: string;
}
