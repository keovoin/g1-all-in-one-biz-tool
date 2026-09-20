"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const deal_entity_1 = require("./deal.entity");
const deal_controller_1 = require("./deal.controller");
const deal_service_1 = require("./deal.service");
const type_orm_deal_repository_1 = require("./repository/type-orm-deal.repository");
const mikro_orm_deal_repository_1 = require("./repository/mikro-orm-deal.repository");
let DealModule = class DealModule {
};
exports.DealModule = DealModule;
exports.DealModule = DealModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([deal_entity_1.Deal]), nestjs_1.MikroOrmModule.forFeature([deal_entity_1.Deal]), role_permission_module_1.RolePermissionModule],
        controllers: [deal_controller_1.DealController],
        providers: [deal_service_1.DealService, type_orm_deal_repository_1.TypeOrmDealRepository, mikro_orm_deal_repository_1.MikroOrmDealRepository],
        exports: [deal_service_1.DealService, type_orm_deal_repository_1.TypeOrmDealRepository, mikro_orm_deal_repository_1.MikroOrmDealRepository]
    })
], DealModule);
//# sourceMappingURL=deal.module.js.map