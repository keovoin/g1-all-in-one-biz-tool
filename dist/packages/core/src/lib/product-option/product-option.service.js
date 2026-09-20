"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const crud_1 = require("./../core/crud");
const type_orm_product_option_repository_1 = require("./repository/type-orm-product-option.repository");
const mikro_orm_product_option_repository_1 = require("./repository/mikro-orm-product-option.repository");
const type_orm_product_option_translation_repository_1 = require("./repository/type-orm-product-option-translation.repository");
let ProductOptionService = class ProductOptionService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductOptionRepository, mikroOrmProductOptionRepository, typeOrmProductOptionTranslationRepository) {
        super(typeOrmProductOptionRepository, mikroOrmProductOptionRepository);
        this.typeOrmProductOptionRepository = typeOrmProductOptionRepository;
        this.mikroOrmProductOptionRepository = mikroOrmProductOptionRepository;
        this.typeOrmProductOptionTranslationRepository = typeOrmProductOptionTranslationRepository;
    }
    async saveProductOptionTranslations(translationsInput) {
        return this.typeOrmProductOptionTranslationRepository.save(translationsInput);
    }
    async saveProductOptionTranslation(translationInput) {
        return this.typeOrmProductOptionTranslationRepository.save(translationInput);
    }
    /**
     * Delete multiple product options.
     */
    async deleteBulk(productOptionsInput) {
        const ids = productOptionsInput.filter((o) => o.id).map((o) => o.id);
        if (ids.length > 0) {
            await this.delete({ id: (0, typeorm_1.In)(ids) });
        }
    }
    async deleteOptionTranslationsBulk(productOptionTranslationsInput) {
        return this.typeOrmProductOptionTranslationRepository.remove(productOptionTranslationsInput);
    }
};
exports.ProductOptionService = ProductOptionService;
exports.ProductOptionService = ProductOptionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_option_repository_1.TypeOrmProductOptionRepository,
        mikro_orm_product_option_repository_1.MikroOrmProductOptionRepository,
        type_orm_product_option_translation_repository_1.TypeOrmProductOptionTranslationRepository])
], ProductOptionService);
//# sourceMappingURL=product-option.service.js.map