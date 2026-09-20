import { IProductOptionGroupTranslation } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { ProductOptionGroup } from './product-option-group.entity';
export declare class ProductOptionGroupTranslation extends TenantOrganizationBaseEntity implements IProductOptionGroupTranslation {
    name: string;
    languageCode: string;
    /**
     * ProductOptionGroup
     */
    reference: ProductOptionGroup;
    referenceId: string;
}
