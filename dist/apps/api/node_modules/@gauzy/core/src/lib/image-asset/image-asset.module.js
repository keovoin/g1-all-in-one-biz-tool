"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAssetModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const image_asset_controller_1 = require("./image-asset.controller");
const image_asset_entity_1 = require("./image-asset.entity");
const image_asset_service_1 = require("./image-asset.service");
const type_orm_image_asset_repository_1 = require("./repository/type-orm-image-asset.repository");
const mikro_orm_image_asset_repository_1 = require("./repository/mikro-orm-image-asset.repository");
let ImageAssetModule = class ImageAssetModule {
};
exports.ImageAssetModule = ImageAssetModule;
exports.ImageAssetModule = ImageAssetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([image_asset_entity_1.ImageAsset]),
            nestjs_1.MikroOrmModule.forFeature([image_asset_entity_1.ImageAsset]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [image_asset_controller_1.ImageAssetController],
        providers: [image_asset_service_1.ImageAssetService, type_orm_image_asset_repository_1.TypeOrmImageAssetRepository, mikro_orm_image_asset_repository_1.MikroOrmImageAssetRepository, ...handlers_1.CommandHandlers]
    })
], ImageAssetModule);
//# sourceMappingURL=image-asset.module.js.map