"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const product_entity_1 = require("./product.entity");
const product_controller_1 = require("./product.controller");
const product_service_1 = require("./product.service");
const product_variant_module_1 = require("./../product-variant/product-variant.module");
const product_variant_price_module_1 = require("./../product-variant-price/product-variant-price-module");
const product_setting_module_1 = require("./../product-setting/product-setting.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const product_translation_entity_1 = require("./product-translation.entity");
const product_option_module_1 = require("./../product-option/product-option-module");
const handlers_1 = require("./commands/handlers");
const type_orm_product_repository_1 = require("./repository/type-orm-product.repository");
const mikro_orm_product_repository_1 = require("./repository/mikro-orm-product.repository");
const type_orm_product_translation_repository_1 = require("./repository/type-orm-product-translation.repository");
const mikro_orm_product_translation_repository_1 = require("./repository/mikro-orm-product-translation.repository");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, product_translation_entity_1.ProductTranslation]),
            nestjs_1.MikroOrmModule.forFeature([product_entity_1.Product, product_translation_entity_1.ProductTranslation]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule,
            product_setting_module_1.ProductVariantSettingModule,
            product_variant_price_module_1.ProductVariantPriceModule,
            product_option_module_1.ProductOptionModule,
            (0, common_1.forwardRef)(() => product_variant_module_1.ProductVariantModule)
        ],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService, type_orm_product_repository_1.TypeOrmProductRepository, mikro_orm_product_repository_1.MikroOrmProductRepository, type_orm_product_translation_repository_1.TypeOrmProductTranslationRepository, mikro_orm_product_translation_repository_1.MikroOrmProductTranslationRepository, ...handlers_1.CommandHandlers],
        exports: [product_service_1.ProductService]
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map