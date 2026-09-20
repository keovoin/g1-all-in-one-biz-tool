"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantPriceModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const product_variant_price_entity_1 = require("./product-variant-price.entity");
const product_variant_price_controller_1 = require("./product-variant-price.controller");
const product_variant_price_service_1 = require("./product-variant-price.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_product_variant_price_repository_1 = require("./repository/type-orm-product-variant-price.repository");
let ProductVariantPriceModule = class ProductVariantPriceModule {
};
exports.ProductVariantPriceModule = ProductVariantPriceModule;
exports.ProductVariantPriceModule = ProductVariantPriceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_variant_price_entity_1.ProductVariantPrice]),
            nestjs_1.MikroOrmModule.forFeature([product_variant_price_entity_1.ProductVariantPrice]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [product_variant_price_controller_1.ProductVariantPriceController],
        providers: [product_variant_price_service_1.ProductVariantPriceService, type_orm_product_variant_price_repository_1.TypeOrmProductVariantPriceRepository],
        exports: [product_variant_price_service_1.ProductVariantPriceService]
    })
], ProductVariantPriceModule);
//# sourceMappingURL=product-variant-price-module.js.map