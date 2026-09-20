"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const product_type_entity_1 = require("./product-type.entity");
const product_type_controller_1 = require("./product-type.controller");
const product_type_service_1 = require("./product-type.service");
const product_type_translation_entity_1 = require("./product-type-translation.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_product_type_repository_1 = require("./repository/type-orm-product-type.repository");
const mikro_orm_product_type_repository_1 = require("./repository/mikro-orm-product-type.repository");
let ProductTypeModule = class ProductTypeModule {
};
exports.ProductTypeModule = ProductTypeModule;
exports.ProductTypeModule = ProductTypeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_type_entity_1.ProductType, product_type_translation_entity_1.ProductTypeTranslation]),
            nestjs_1.MikroOrmModule.forFeature([product_type_entity_1.ProductType, product_type_translation_entity_1.ProductTypeTranslation]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [product_type_controller_1.ProductTypeController],
        providers: [product_type_service_1.ProductTypeService, type_orm_product_type_repository_1.TypeOrmProductTypeRepository, mikro_orm_product_type_repository_1.MikroOrmProductTypeRepository, ...handlers_1.CommandHandlers]
    })
], ProductTypeModule);
//# sourceMappingURL=product-type.module.js.map