"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const product_category_entity_1 = require("./product-category.entity");
const product_category_service_1 = require("./product-category.service");
const product_category_controller_1 = require("./product-category.controller");
const product_category_translation_entity_1 = require("./product-category-translation.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_product_category_repository_1 = require("./repository/type-orm-product-category.repository");
const mikro_orm_product_category_repository_1 = require("./repository/mikro-orm-product-category.repository");
let ProductCategoryModule = class ProductCategoryModule {
};
exports.ProductCategoryModule = ProductCategoryModule;
exports.ProductCategoryModule = ProductCategoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_category_entity_1.ProductCategory, product_category_translation_entity_1.ProductCategoryTranslation]),
            nestjs_1.MikroOrmModule.forFeature([product_category_entity_1.ProductCategory, product_category_translation_entity_1.ProductCategoryTranslation]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [product_category_controller_1.ProductCategoryController],
        providers: [product_category_service_1.ProductCategoryService, type_orm_product_category_repository_1.TypeOrmProductCategoryRepository, mikro_orm_product_category_repository_1.MikroOrmProductCategoryRepository, ...handlers_1.CommandHandlers],
        exports: [product_category_service_1.ProductCategoryService]
    })
], ProductCategoryModule);
//# sourceMappingURL=product-category.module.js.map