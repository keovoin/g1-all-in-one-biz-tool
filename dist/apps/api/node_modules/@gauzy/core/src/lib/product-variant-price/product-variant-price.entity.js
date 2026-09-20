"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantPrice = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_variant_price_repository_1 = require("./repository/mikro-orm-product-variant-price.repository");
let ProductVariantPrice = class ProductVariantPrice extends internal_1.TenantOrganizationBaseEntity {
};
exports.ProductVariantPrice = ProductVariantPrice;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ProductVariantPrice.prototype, "unitCost", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.CurrenciesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, entity_1.MultiORMColumn)({ default: contracts_1.CurrenciesEnum.USD }),
    tslib_1.__metadata("design:type", String)
], ProductVariantPrice.prototype, "unitCostCurrency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ProductVariantPrice.prototype, "retailPrice", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.CurrenciesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, entity_1.MultiORMColumn)({ default: contracts_1.CurrenciesEnum.USD }),
    tslib_1.__metadata("design:type", String)
], ProductVariantPrice.prototype, "retailPriceCurrency", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.ProductVariant, (productVariant) => productVariant.price, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.ProductVariant)
], ProductVariantPrice.prototype, "productVariant", void 0);
exports.ProductVariantPrice = ProductVariantPrice = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_variant_price', { mikroOrmRepository: () => mikro_orm_product_variant_price_repository_1.MikroOrmProductVariantPriceRepository })
], ProductVariantPrice);
//# sourceMappingURL=product-variant-price.entity.js.map