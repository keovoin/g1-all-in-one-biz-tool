import { IProductOptionTranslatable, IProductOptionTranslation } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { ProductOptionGroup } from './product-option-group.entity';
export declare class ProductOption extends TenantOrganizationBaseEntity implements IProductOptionTranslatable {
    name: string;
    code: string;
    /**
     * ProductOptionGroup
     */
    group?: ProductOptionGroup;
    groupId?: string;
    translations: IProductOptionTranslation[];
}
