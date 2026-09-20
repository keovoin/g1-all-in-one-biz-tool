"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductType = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_type_repository_1 = require("./repository/mikro-orm-product-type.repository");
let ProductType = class ProductType extends internal_1.TranslatableBase {
};
exports.ProductType = ProductType;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.ProductTypesIconsEnum }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductType.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Product, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Product, (product) => product.productType),
    tslib_1.__metadata("design:type", Array)
], ProductType.prototype, "products", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductTypeTranslation, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.ProductTypeTranslation, (productTypeTranslation) => productTypeTranslation.reference, {
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true,
        /** Database cascade actions. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], ProductType.prototype, "translations", void 0);
exports.ProductType = ProductType = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_type', { mikroOrmRepository: () => mikro_orm_product_type_repository_1.MikroOrmProductTypeRepository })
], ProductType);
//# sourceMappingURL=product-type.entity.js.map