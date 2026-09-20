"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const dashboard_entity_1 = require("./dashboard.entity");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
const type_orm_dashboard_repository_1 = require("./repository/type-orm-dashboard.repository");
const mikro_orm_dashboard_repository_1 = require("./repository/mikro-orm-dashboard.repository");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([dashboard_entity_1.Dashboard]),
            nestjs_1.MikroOrmModule.forFeature([dashboard_entity_1.Dashboard]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService, type_orm_dashboard_repository_1.TypeOrmDashboardRepository, mikro_orm_dashboard_repository_1.MikroOrmDashboardRepository, ...handlers_1.CommandHandlers]
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map