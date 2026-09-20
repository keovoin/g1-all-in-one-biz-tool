"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const product_option_entity_1 = require("./product-option.entity");
const product_option_service_1 = require("./product-option.service");
const product_option_controller_1 = require("./product-option.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const product_option_group_service_1 = require("./product-option-group.service");
const product_option_translation_entity_1 = require("./product-option-translation.entity");
const product_option_group_entity_1 = require("./product-option-group.entity");
const product_option_group_translation_entity_1 = require("./product-option-group-translation.entity");
const type_orm_product_option_repository_1 = require("./repository/type-orm-product-option.repository");
const type_orm_product_option_translation_repository_1 = require("./repository/type-orm-product-option-translation.repository");
const type_orm_product_option_group_repository_1 = require("./repository/type-orm-product-option-group.repository");
const type_orm_product_option_group_translation_repository_1 = require("./repository/type-orm-product-option-group-translation.repository");
let ProductOptionModule = class ProductOptionModule {
};
exports.ProductOptionModule = ProductOptionModule;
exports.ProductOptionModule = ProductOptionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_option_entity_1.ProductOption,
                product_option_translation_entity_1.ProductOptionTranslation,
                product_option_group_entity_1.ProductOptionGroup,
                product_option_group_translation_entity_1.ProductOptionGroupTranslation
            ]),
            nestjs_1.MikroOrmModule.forFeature([
                product_option_entity_1.ProductOption,
                product_option_translation_entity_1.ProductOptionTranslation,
                product_option_group_entity_1.ProductOptionGroup,
                product_option_group_translation_entity_1.ProductOptionGroupTranslation
            ]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [product_option_controller_1.ProductOptionController],
        providers: [
            product_option_service_1.ProductOptionService,
            product_option_group_service_1.ProductOptionGroupService,
            type_orm_product_option_repository_1.TypeOrmProductOptionRepository,
            type_orm_product_option_translation_repository_1.TypeOrmProductOptionTranslationRepository,
            type_orm_product_option_group_repository_1.TypeOrmProductOptionGroupRepository,
            type_orm_product_option_group_translation_repository_1.TypeOrmProductOptionGroupTranslationRepository
        ],
        exports: [product_option_service_1.ProductOptionService, product_option_group_service_1.ProductOptionGroupService]
    })
], ProductOptionModule);
//# sourceMappingURL=product-option-module.js.map