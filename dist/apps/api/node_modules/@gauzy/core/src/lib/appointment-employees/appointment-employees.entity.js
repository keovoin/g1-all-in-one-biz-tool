"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEmployee = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_appointment_employee_repository_1 = require("./repository/mikro-orm-appointment-employee.repository");
let AppointmentEmployee = class AppointmentEmployee extends internal_1.TenantOrganizationBaseEntity {
};
exports.AppointmentEmployee = AppointmentEmployee;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], AppointmentEmployee.prototype, "appointmentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], AppointmentEmployee.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], AppointmentEmployee.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.EmployeeAppointment }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.EmployeeAppointment, (employeeAppointment) => employeeAppointment?.invitees, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Object)
], AppointmentEmployee.prototype, "employeeAppointment", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employeeAppointment),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], AppointmentEmployee.prototype, "employeeAppointmentId", void 0);
exports.AppointmentEmployee = AppointmentEmployee = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('appointment_employee', { mikroOrmRepository: () => mikro_orm_appointment_employee_repository_1.MikroOrmAppointmentEmployeeRepository })
], AppointmentEmployee);
//# sourceMappingURL=appointment-employees.entity.js.map