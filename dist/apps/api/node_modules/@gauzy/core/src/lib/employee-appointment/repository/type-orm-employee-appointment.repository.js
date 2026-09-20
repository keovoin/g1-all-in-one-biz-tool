"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeAppointmentRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_appointment_entity_1 = require("../employee-appointment.entity");
let TypeOrmEmployeeAppointmentRepository = class TypeOrmEmployeeAppointmentRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeAppointmentRepository = TypeOrmEmployeeAppointmentRepository;
exports.TypeOrmEmployeeAppointmentRepository = TypeOrmEmployeeAppointmentRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_appointment_entity_1.EmployeeAppointment)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeAppointmentRepository);
//# sourceMappingURL=type-orm-employee-appointment.repository.js.map