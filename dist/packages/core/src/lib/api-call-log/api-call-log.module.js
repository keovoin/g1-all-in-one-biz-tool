"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCallLogModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const api_call_log_controller_1 = require("./api-call-log.controller");
const api_call_log_entity_1 = require("./api-call-log.entity");
const api_call_log_service_1 = require("./api-call-log.service");
const api_call_log_middleware_1 = require("./api-call-log-middleware");
const type_orm_api_call_log_repository_1 = require("./repository/type-orm-api-call-log.repository");
const mikro_orm_api_call_log_repository_1 = require("./repository/mikro-orm-api-call-log.repository");
let ApiCallLogModule = class ApiCallLogModule {
    /**
     * Configures the middleware for Time Tracking routes (POST, PUT, PATCH, DELETE)
     * excluding the '/timesheet/statistics' route.
     *
     * @param consumer The middleware consumer used to apply the middleware to specific routes.
     */
    configure(consumer) {
        consumer.apply(api_call_log_middleware_1.ApiCallLogMiddleware).forRoutes(
        // POST Routes
        { path: '/timesheet/timer/*', method: common_1.RequestMethod.POST }, { path: '/timesheet/time-log', method: common_1.RequestMethod.POST }, { path: '/timesheet/activity/bulk', method: common_1.RequestMethod.POST }, { path: '/timesheet/time-slot', method: common_1.RequestMethod.POST }, { path: '/timesheet/screenshot', method: common_1.RequestMethod.POST }, 
        // PUT Routes
        { path: '/timesheet/time-log/:id', method: common_1.RequestMethod.PUT }, { path: '/timesheet/time-slot/:id', method: common_1.RequestMethod.PUT }, { path: '/timesheet/status', method: common_1.RequestMethod.PUT }, { path: '/timesheet/submit', method: common_1.RequestMethod.PUT }, 
        // DELETE Routes
        { path: '/timesheet/time-log', method: common_1.RequestMethod.DELETE }, { path: '/timesheet/time-slot', method: common_1.RequestMethod.DELETE }, { path: '/timesheet/screenshot/:id', method: common_1.RequestMethod.DELETE });
    }
};
exports.ApiCallLogModule = ApiCallLogModule;
exports.ApiCallLogModule = ApiCallLogModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([api_call_log_entity_1.ApiCallLog]), nestjs_1.MikroOrmModule.forFeature([api_call_log_entity_1.ApiCallLog]), role_permission_module_1.RolePermissionModule],
        controllers: [api_call_log_controller_1.ApiCallLogController],
        providers: [api_call_log_service_1.ApiCallLogService, type_orm_api_call_log_repository_1.TypeOrmApiCallLogRepository, mikro_orm_api_call_log_repository_1.MikroOrmApiCallLogRepository, api_call_log_middleware_1.ApiCallLogMiddleware],
        exports: [api_call_log_service_1.ApiCallLogService]
    })
], ApiCallLogModule);
//# sourceMappingURL=api-call-log.module.js.map