"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAvailabilityModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const employee_availability_service_1 = require("./employee-availability.service");
const employee_availability_controller_1 = require("./employee-availability.controller");
const employee_availability_entity_1 = require("./employee-availability.entity");
const type_orm_employee_availability_repository_1 = require("./repository/type-orm-employee-availability.repository");
const mikro_orm_employee_availability_repository_1 = require("./repository/mikro-orm-employee-availability.repository");
let EmployeeAvailabilityModule = class EmployeeAvailabilityModule {
};
exports.EmployeeAvailabilityModule = EmployeeAvailabilityModule;
exports.EmployeeAvailabilityModule = EmployeeAvailabilityModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_availability_entity_1.EmployeeAvailability]),
            nestjs_1.MikroOrmModule.forFeature([employee_availability_entity_1.EmployeeAvailability]),
            cqrs_1.CqrsModule
        ],
        providers: [
            employee_availability_service_1.EmployeeAvailabilityService,
            type_orm_employee_availability_repository_1.TypeOrmEmployeeAvailabilityRepository,
            mikro_orm_employee_availability_repository_1.MikroOrmEmployeeAvailabilityRepository,
            ...handlers_1.CommandHandlers
        ],
        controllers: [employee_availability_controller_1.EmployeeAvailabilityController]
    })
], EmployeeAvailabilityModule);
//# sourceMappingURL=employee-availability.module.js.map