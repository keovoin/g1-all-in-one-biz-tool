"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryTranslation = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_category_translation_repository_1 = require("./repository/mikro-orm-product-category-translation.repository");
let ProductCategoryTranslation = class ProductCategoryTranslation extends internal_1.TranslationBase {
};
exports.ProductCategoryTranslation = ProductCategoryTranslation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ProductCategoryTranslation.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductCategoryTranslation.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], ProductCategoryTranslation.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductCategory }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ProductCategory, (productCategory) => productCategory.translations, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.ProductCategory)
], ProductCategoryTranslation.prototype, "reference", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.reference),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductCategoryTranslation.prototype, "referenceId", void 0);
exports.ProductCategoryTranslation = ProductCategoryTranslation = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_category_translation', { mikroOrmRepository: () => mikro_orm_product_category_translation_repository_1.MikroOrmProductCategoryTranslationRepository })
], ProductCategoryTranslation);
//# sourceMappingURL=product-category-translation.entity.js.map