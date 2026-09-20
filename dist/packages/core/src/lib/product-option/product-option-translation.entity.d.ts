import { IProductOptionTranslation } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity, ProductOption } from '../core/entities/internal';
export declare class ProductOptionTranslation extends TenantOrganizationBaseEntity implements IProductOptionTranslation {
    name: string;
    description: string;
    languageCode: string;
    /**
     * ProductOption
     */
    reference: ProductOption;
    referenceId: string;
}
