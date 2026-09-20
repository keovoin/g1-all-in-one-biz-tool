"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantSettingModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const product_setting_entity_1 = require("./product-setting.entity");
const product_setting_service_1 = require("./product-setting.service");
const product_setting_controller_1 = require("./product-setting.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_product_setting_repository_1 = require("./repository/type-orm-product-setting.repository");
const mikro_orm_product_setting_repository_1 = require("./repository/mikro-orm-product-setting.repository");
let ProductVariantSettingModule = class ProductVariantSettingModule {
};
exports.ProductVariantSettingModule = ProductVariantSettingModule;
exports.ProductVariantSettingModule = ProductVariantSettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_setting_entity_1.ProductVariantSetting]),
            nestjs_1.MikroOrmModule.forFeature([product_setting_entity_1.ProductVariantSetting]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [product_setting_controller_1.ProductVariantSettingController],
        providers: [product_setting_service_1.ProductVariantSettingService, type_orm_product_setting_repository_1.TypeOrmProductVariantSettingRepository, mikro_orm_product_setting_repository_1.MikroOrmProductVariantSettingRepository],
        exports: [product_setting_service_1.ProductVariantSettingService]
    })
], ProductVariantSettingModule);
//# sourceMappingURL=product-setting.module.js.map