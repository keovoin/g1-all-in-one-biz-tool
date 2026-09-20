"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecentVisitModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const cqrs_1 = require("@nestjs/cqrs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_recent_visit_entity_1 = require("./employee-recent-visit.entity");
const employee_recent_visit_service_1 = require("./employee-recent-visit.service");
const employee_recent_visit_controller_1 = require("./employee-recent-visit.controller");
const handlers_1 = require("./events/handlers");
const type_orm_employee_recent_visit_repository_1 = require("./repository/type-orm-employee-recent-visit.repository");
const mikro_orm_employee_recent_visit_repository_1 = require("./repository/mikro-orm-employee-recent-visit.repository");
let EmployeeRecentVisitModule = class EmployeeRecentVisitModule {
};
exports.EmployeeRecentVisitModule = EmployeeRecentVisitModule;
exports.EmployeeRecentVisitModule = EmployeeRecentVisitModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_recent_visit_entity_1.EmployeeRecentVisit]),
            nestjs_1.MikroOrmModule.forFeature([employee_recent_visit_entity_1.EmployeeRecentVisit]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [employee_recent_visit_controller_1.EmployeeRecentVisitController],
        providers: [employee_recent_visit_service_1.EmployeeRecentVisitService, type_orm_employee_recent_visit_repository_1.TypeOrmEmployeeRecentVisitRepository, mikro_orm_employee_recent_visit_repository_1.MikroOrmEmployeeRecentVisitRepository, ...handlers_1.EventHandlers],
        exports: [employee_recent_visit_service_1.EmployeeRecentVisitService, type_orm_employee_recent_visit_repository_1.TypeOrmEmployeeRecentVisitRepository, mikro_orm_employee_recent_visit_repository_1.MikroOrmEmployeeRecentVisitRepository]
    })
], EmployeeRecentVisitModule);
//# sourceMappingURL=employee-recent-visit.module.js.map