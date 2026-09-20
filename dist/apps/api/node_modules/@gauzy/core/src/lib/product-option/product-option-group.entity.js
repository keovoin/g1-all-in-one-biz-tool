"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionGroup = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_option_group_repository_1 = require("./repository/mikro-orm-product-option-group.repository");
let ProductOptionGroup = class ProductOptionGroup extends internal_1.TenantOrganizationBaseEntity {
};
exports.ProductOptionGroup = ProductOptionGroup;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ProductOptionGroup.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Product }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Product, (product) => product.optionGroups),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.Product)
], ProductOptionGroup.prototype, "product", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.product),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductOptionGroup.prototype, "productId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductOption, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.ProductOption, (productOption) => productOption.group, {
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true,
    }),
    tslib_1.__metadata("design:type", Array)
], ProductOptionGroup.prototype, "options", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductOptionGroupTranslation, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.ProductOptionGroupTranslation, (translation) => translation.reference, {
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true,
    }),
    tslib_1.__metadata("design:type", Array)
], ProductOptionGroup.prototype, "translations", void 0);
exports.ProductOptionGroup = ProductOptionGroup = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_option_group', { mikroOrmRepository: () => mikro_orm_product_option_group_repository_1.MikroOrmProductOptionGroupRepository })
], ProductOptionGroup);
//# sourceMappingURL=product-option-group.entity.js.map