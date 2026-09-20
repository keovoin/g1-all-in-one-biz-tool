"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategory = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_category_repository_1 = require("./repository/mikro-orm-product-category.repository");
let ProductCategory = class ProductCategory extends internal_1.TranslatableBase {
};
exports.ProductCategory = ProductCategory;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductCategory.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ImageAsset, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL',
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.ImageAsset)
], ProductCategory.prototype, "image", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.image),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], ProductCategory.prototype, "imageId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Product, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Product, (product) => product.productCategory),
    tslib_1.__metadata("design:type", Array)
], ProductCategory.prototype, "products", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductCategoryTranslation, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.ProductCategoryTranslation, (instance) => instance.reference, {
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true,
        /** Database cascade action. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], ProductCategory.prototype, "translations", void 0);
exports.ProductCategory = ProductCategory = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_category', { mikroOrmRepository: () => mikro_orm_product_category_repository_1.MikroOrmProductCategoryRepository })
], ProductCategory);
//# sourceMappingURL=product-category.entity.js.map