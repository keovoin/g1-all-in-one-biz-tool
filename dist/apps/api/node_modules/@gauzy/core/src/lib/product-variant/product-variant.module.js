"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const product_variant_entity_1 = require("./product-variant.entity");
const product_variant_controller_1 = require("./product-variant.controller");
const product_variant_service_1 = require("./product-variant.service");
const product_variant_price_module_1 = require("./../product-variant-price/product-variant-price-module");
const product_setting_module_1 = require("./../product-setting/product-setting.module");
const product_module_1 = require("./../product/product.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_product_variant_repository_1 = require("./repository/type-orm-product-variant.repository");
const mikro_orm_product_variant_repository_1 = require("./repository/mikro-orm-product-variant.repository");
let ProductVariantModule = class ProductVariantModule {
};
exports.ProductVariantModule = ProductVariantModule;
exports.ProductVariantModule = ProductVariantModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([product_variant_entity_1.ProductVariant]),
            nestjs_1.MikroOrmModule.forFeature([product_variant_entity_1.ProductVariant]),
            role_permission_module_1.RolePermissionModule,
            product_variant_price_module_1.ProductVariantPriceModule,
            product_setting_module_1.ProductVariantSettingModule,
            (0, common_1.forwardRef)(() => product_module_1.ProductModule)
        ],
        controllers: [product_variant_controller_1.ProductVariantController],
        providers: [product_variant_service_1.ProductVariantService, type_orm_product_variant_repository_1.TypeOrmProductVariantRepository, mikro_orm_product_variant_repository_1.MikroOrmProductVariantRepository, ...handlers_1.CommandHandlers],
        exports: [product_variant_service_1.ProductVariantService]
    })
], ProductVariantModule);
//# sourceMappingURL=product-variant.module.js.map