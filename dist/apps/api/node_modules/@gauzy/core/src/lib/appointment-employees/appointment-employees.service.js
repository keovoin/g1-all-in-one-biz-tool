"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEmployeesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tenant_aware_crud_service_1 = require("./../core/crud/tenant-aware-crud.service");
const type_orm_appointment_employee_repository_1 = require("./repository/type-orm-appointment-employee.repository");
const mikro_orm_appointment_employee_repository_1 = require("./repository/mikro-orm-appointment-employee.repository");
let AppointmentEmployeesService = class AppointmentEmployeesService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmAppointmentEmployeeRepository, mikroOrmAppointmentEmployeeRepository) {
        super(typeOrmAppointmentEmployeeRepository, mikroOrmAppointmentEmployeeRepository);
    }
};
exports.AppointmentEmployeesService = AppointmentEmployeesService;
exports.AppointmentEmployeesService = AppointmentEmployeesService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_appointment_employee_repository_1.TypeOrmAppointmentEmployeeRepository,
        mikro_orm_appointment_employee_repository_1.MikroOrmAppointmentEmployeeRepository])
], AppointmentEmployeesService);
//# sourceMappingURL=appointment-employees.service.js.map