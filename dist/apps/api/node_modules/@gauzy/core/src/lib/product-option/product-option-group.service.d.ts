import { ProductOptionGroupTranslation } from './../core/entities/internal';
import { TenantAwareCrudService } from './../core/crud';
import { IProductOptionGroupTranslation, IProductOptionGroupTranslatable } from '@gauzy/contracts';
import { ProductOptionGroup } from './product-option-group.entity';
import { MikroOrmProductOptionGroupRepository } from './repository/mikro-orm-product-option-group.repository';
import { TypeOrmProductOptionGroupRepository } from './repository/type-orm-product-option-group.repository';
import { TypeOrmProductOptionGroupTranslationRepository } from './repository/type-orm-product-option-group-translation.repository';
export declare class ProductOptionGroupService extends TenantAwareCrudService<ProductOptionGroup> {
    readonly typeOrmProductOptionGroupTranslationRepository: TypeOrmProductOptionGroupTranslationRepository;
    constructor(typeOrmProductOptionGroupRepository: TypeOrmProductOptionGroupRepository, mikroOrmProductOptionGroupRepository: MikroOrmProductOptionGroupRepository, typeOrmProductOptionGroupTranslationRepository: TypeOrmProductOptionGroupTranslationRepository);
    deleteBulk(productOptionGroupsInput: IProductOptionGroupTranslatable[]): Promise<void>;
    createTranslations(optionGroupTranslations: ProductOptionGroupTranslation[]): Promise<ProductOptionGroupTranslation[]>;
    createTranslation(optionGroupTranslation: ProductOptionGroupTranslation): Promise<ProductOptionGroupTranslation>;
    deleteGroupTranslationsBulk(productOptionGroupTranslationsInput: IProductOptionGroupTranslation[]): Promise<ProductOptionGroupTranslation[]>;
}
