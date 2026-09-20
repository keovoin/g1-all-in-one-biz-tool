"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardWidgetModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const dashboard_widget_entity_1 = require("./dashboard-widget.entity");
const dashboard_widget_service_1 = require("./dashboard-widget.service");
const dashboard_widget_controller_1 = require("./dashboard-widget.controller");
const type_orm_dashboard_widget_repository_1 = require("./repository/type-orm-dashboard-widget.repository");
const mikro_orm_dashboard_widget_repository_1 = require("./repository/mikro-orm-dashboard-widget.repository");
let DashboardWidgetModule = class DashboardWidgetModule {
};
exports.DashboardWidgetModule = DashboardWidgetModule;
exports.DashboardWidgetModule = DashboardWidgetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([dashboard_widget_entity_1.DashboardWidget]),
            nestjs_1.MikroOrmModule.forFeature([dashboard_widget_entity_1.DashboardWidget]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [dashboard_widget_controller_1.DashboardWidgetController],
        providers: [dashboard_widget_service_1.DashboardWidgetService, type_orm_dashboard_widget_repository_1.TypeOrmDashboardWidgetRepository, mikro_orm_dashboard_widget_repository_1.MikroOrmDashboardWidgetRepository, ...handlers_1.CommandHandlers]
    })
], DashboardWidgetModule);
//# sourceMappingURL=dashboard-widget.module.js.map