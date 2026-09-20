"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const time_off_request_service_1 = require("./time-off-request.service");
const time_off_request_entity_1 = require("./time-off-request.entity");
const time_off_request_controller_1 = require("./time-off-request.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const request_approval_module_1 = require("../request-approval/request-approval.module");
const handlers_1 = require("./commands/handlers");
const type_orm_time_off_request_repository_1 = require("./repository/type-orm-time-off-request.repository");
const mikro_orm_time_off_request_repository_1 = require("./repository/mikro-orm-time-off-request.repository");
let TimeOffRequestModule = class TimeOffRequestModule {
};
exports.TimeOffRequestModule = TimeOffRequestModule;
exports.TimeOffRequestModule = TimeOffRequestModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([time_off_request_entity_1.TimeOffRequest]),
            nestjs_1.MikroOrmModule.forFeature([time_off_request_entity_1.TimeOffRequest]),
            role_permission_module_1.RolePermissionModule,
            (0, common_1.forwardRef)(() => request_approval_module_1.RequestApprovalModule),
            cqrs_1.CqrsModule
        ],
        controllers: [time_off_request_controller_1.TimeOffRequestController],
        providers: [time_off_request_service_1.TimeOffRequestService, type_orm_time_off_request_repository_1.TypeOrmTimeOffRequestRepository, mikro_orm_time_off_request_repository_1.MikroOrmTimeOffRequestRepository, ...handlers_1.CommandHandlers],
        exports: [time_off_request_service_1.TimeOffRequestService]
    })
], TimeOffRequestModule);
//# sourceMappingURL=time-off-request.module.js.map