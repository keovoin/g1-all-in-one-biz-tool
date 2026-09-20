"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const event_bus_module_1 = require("../../event-bus/event-bus.module");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const screenshot_entity_1 = require("./screenshot.entity");
const screenshot_controller_1 = require("./screenshot.controller");
const screenshot_service_1 = require("./screenshot.service");
const time_slot_module_1 = require("./../time-slot/time-slot.module");
const integration_tenant_module_1 = require("./../../integration-tenant/integration-tenant.module");
const type_orm_screenshot_repository_1 = require("./repository/type-orm-screenshot.repository");
const mikro_orm_screenshot_repository_1 = require("./repository/mikro-orm-screenshot.repository");
let ScreenshotModule = class ScreenshotModule {
};
exports.ScreenshotModule = ScreenshotModule;
exports.ScreenshotModule = ScreenshotModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [screenshot_controller_1.ScreenshotController],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([screenshot_entity_1.Screenshot]),
            nestjs_1.MikroOrmModule.forFeature([screenshot_entity_1.Screenshot]),
            role_permission_module_1.RolePermissionModule,
            time_slot_module_1.TimeSlotModule,
            integration_tenant_module_1.IntegrationTenantModule,
            cqrs_1.CqrsModule,
            event_bus_module_1.EventBusModule
        ],
        providers: [screenshot_service_1.ScreenshotService, type_orm_screenshot_repository_1.TypeOrmScreenshotRepository, mikro_orm_screenshot_repository_1.MikroOrmScreenshotRepository, ...handlers_1.CommandHandlers],
        exports: [screenshot_service_1.ScreenshotService, type_orm_screenshot_repository_1.TypeOrmScreenshotRepository, mikro_orm_screenshot_repository_1.MikroOrmScreenshotRepository]
    })
], ScreenshotModule);
//# sourceMappingURL=screenshot.module.js.map