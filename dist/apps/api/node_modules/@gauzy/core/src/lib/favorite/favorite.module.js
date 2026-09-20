"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_module_1 = require("../employee/employee.module");
const favorite_entity_1 = require("./favorite.entity");
const type_orm_favorite_repository_1 = require("./repository/type-orm-favorite.repository");
const mikro_orm_favorite_repository_1 = require("./repository/mikro-orm-favorite.repository");
const favorite_service_1 = require("./favorite.service");
const favorite_controller_1 = require("./favorite.controller");
const global_favorite_service_module_1 = require("./global-favorite-service.module");
let FavoriteModule = class FavoriteModule {
};
exports.FavoriteModule = FavoriteModule;
exports.FavoriteModule = FavoriteModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([favorite_entity_1.Favorite]),
            nestjs_1.MikroOrmModule.forFeature([favorite_entity_1.Favorite]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            global_favorite_service_module_1.GlobalFavoriteModule
        ],
        controllers: [favorite_controller_1.FavoriteController],
        providers: [favorite_service_1.FavoriteService, type_orm_favorite_repository_1.TypeOrmFavoriteRepository, mikro_orm_favorite_repository_1.MikroOrmFavoriteRepository],
        exports: [favorite_service_1.FavoriteService, type_orm_favorite_repository_1.TypeOrmFavoriteRepository, mikro_orm_favorite_repository_1.MikroOrmFavoriteRepository]
    })
], FavoriteModule);
//# sourceMappingURL=favorite.module.js.map