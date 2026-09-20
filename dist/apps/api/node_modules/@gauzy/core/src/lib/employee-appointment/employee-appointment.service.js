"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAppointmentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@gauzy/config");
const crud_1 = require("./../core/crud");
const type_orm_employee_appointment_repository_1 = require("./repository/type-orm-employee-appointment.repository");
const mikro_orm_employee_appointment_repository_1 = require("./repository/mikro-orm-employee-appointment.repository");
let EmployeeAppointmentService = class EmployeeAppointmentService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEmployeeAppointmentRepository, mikroOrmEmployeeAppointmentRepository) {
        super(typeOrmEmployeeAppointmentRepository, mikroOrmEmployeeAppointmentRepository);
    }
    /**
     * Finds an employee appointment by its ID.
     *
     * @param id - The unique identifier of the employee appointment.
     * @param relations - An optional array of related entities to include in the query result. Defaults to an empty array.
     * @returns A promise that resolves to the employee appointment entity, including any specified relations.
     */
    async findById(id, relations = []) {
        return await super.findOneByIdString(id, { relations });
    }
    /**
     * Saves a new employee appointment to the database.
     *
     * @param input - The data required to create a new employee appointment, encapsulated in an `IEmployeeAppointmentCreateInput` object.
     * @returns A promise that resolves to the saved `EmployeeAppointment` entity.
     */
    async saveAppointment(input) {
        return await this.save(input);
    }
    /**
     * Signs an appointment ID using a JSON Web Token (JWT).
     *
     * @param id - The ID of the appointment to be signed.
     * @returns A signed JWT token containing the appointment ID.
     */
    signAppointmentId(id) {
        return (0, jsonwebtoken_1.sign)({ appointmentId: id }, config_1.environment.JWT_SECRET, {});
    }
    /**
     * Decodes a signed appointment ID from a JSON Web Token (JWT).
     *
     * @param token
     * @returns
     */
    decodeSignToken(token) {
        return (0, jsonwebtoken_1.decode)(token);
    }
};
exports.EmployeeAppointmentService = EmployeeAppointmentService;
exports.EmployeeAppointmentService = EmployeeAppointmentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_appointment_repository_1.TypeOrmEmployeeAppointmentRepository,
        mikro_orm_employee_appointment_repository_1.MikroOrmEmployeeAppointmentRepository])
], EmployeeAppointmentService);
//# sourceMappingURL=employee-appointment.service.js.map