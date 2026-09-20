import { TenantAwareCrudService } from './../core/crud';
import { ProductOptionTranslation } from './../core/entities/internal';
import { IProductOptionTranslatable, IProductOptionTranslation } from '@gauzy/contracts';
import { ProductOption } from './product-option.entity';
import { TypeOrmProductOptionRepository } from './repository/type-orm-product-option.repository';
import { MikroOrmProductOptionRepository } from './repository/mikro-orm-product-option.repository';
import { TypeOrmProductOptionTranslationRepository } from './repository/type-orm-product-option-translation.repository';
export declare class ProductOptionService extends TenantAwareCrudService<ProductOption> {
    readonly typeOrmProductOptionRepository: TypeOrmProductOptionRepository;
    readonly mikroOrmProductOptionRepository: MikroOrmProductOptionRepository;
    readonly typeOrmProductOptionTranslationRepository: TypeOrmProductOptionTranslationRepository;
    constructor(typeOrmProductOptionRepository: TypeOrmProductOptionRepository, mikroOrmProductOptionRepository: MikroOrmProductOptionRepository, typeOrmProductOptionTranslationRepository: TypeOrmProductOptionTranslationRepository);
    saveProductOptionTranslations(translationsInput: ProductOptionTranslation[]): Promise<ProductOptionTranslation[]>;
    saveProductOptionTranslation(translationInput: ProductOptionTranslation): Promise<ProductOptionTranslation>;
    /**
     * Delete multiple product options.
     */
    deleteBulk(productOptionsInput: IProductOptionTranslatable[]): Promise<void>;
    deleteOptionTranslationsBulk(productOptionTranslationsInput: IProductOptionTranslation[]): Promise<ProductOptionTranslation[]>;
}
