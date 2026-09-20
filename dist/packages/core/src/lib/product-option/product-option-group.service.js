"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionGroupService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const crud_1 = require("./../core/crud");
const mikro_orm_product_option_group_repository_1 = require("./repository/mikro-orm-product-option-group.repository");
const type_orm_product_option_group_repository_1 = require("./repository/type-orm-product-option-group.repository");
const type_orm_product_option_group_translation_repository_1 = require("./repository/type-orm-product-option-group-translation.repository");
let ProductOptionGroupService = class ProductOptionGroupService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductOptionGroupRepository, mikroOrmProductOptionGroupRepository, typeOrmProductOptionGroupTranslationRepository) {
        super(typeOrmProductOptionGroupRepository, mikroOrmProductOptionGroupRepository);
        this.typeOrmProductOptionGroupTranslationRepository = typeOrmProductOptionGroupTranslationRepository;
    }
    async deleteBulk(productOptionGroupsInput) {
        const ids = productOptionGroupsInput
            .filter((g) => 'id' in g && !!g.id)
            .map((g) => g.id);
        if (ids.length > 0) {
            await this.delete({ id: (0, typeorm_1.In)(ids) });
        }
    }
    async createTranslations(optionGroupTranslations) {
        return this.typeOrmProductOptionGroupTranslationRepository.save(optionGroupTranslations);
    }
    async createTranslation(optionGroupTranslation) {
        return this.typeOrmProductOptionGroupTranslationRepository.save(optionGroupTranslation);
    }
    async deleteGroupTranslationsBulk(productOptionGroupTranslationsInput) {
        return this.typeOrmProductOptionGroupTranslationRepository.remove(productOptionGroupTranslationsInput);
    }
};
exports.ProductOptionGroupService = ProductOptionGroupService;
exports.ProductOptionGroupService = ProductOptionGroupService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_option_group_repository_1.TypeOrmProductOptionGroupRepository,
        mikro_orm_product_option_group_repository_1.MikroOrmProductOptionGroupRepository,
        type_orm_product_option_group_translation_repository_1.TypeOrmProductOptionGroupTranslationRepository])
], ProductOptionGroupService);
//# sourceMappingURL=product-option-group.service.js.map