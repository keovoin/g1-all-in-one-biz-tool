"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAvailability = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const employee_availability_status_pipe_1 = require("./pipes/employee-availability-status.pipe");
const validators_1 = require("../shared/validators");
let EmployeeAvailability = class EmployeeAvailability extends internal_1.TenantOrganizationBaseEntity {
};
exports.EmployeeAvailability = EmployeeAvailability;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, validators_1.IsBeforeDate)(EmployeeAvailability, (it) => it.endDate, {
        message: 'Start date must be before to the end date'
    }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], EmployeeAvailability.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], EmployeeAvailability.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Day of the week (0 = Sunday, 6 = Saturday)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'Day of week must be between 0 and 6' }),
    (0, class_validator_1.Max)(6, { message: 'Day of week must be between 0 and 6' }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], EmployeeAvailability.prototype, "dayOfWeek", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.AvailabilityStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.AvailabilityStatusEnum),
    (0, entity_1.MultiORMColumn)({ type: 'int', transformer: new employee_availability_status_pipe_1.AvailabilityStatusTransformer() }),
    tslib_1.__metadata("design:type", String)
], EmployeeAvailability.prototype, "availabilityStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'Optional notes (e.g., "Available until 2 PM")'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeAvailability.prototype, "availabilityNotes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (it) => it.availabilities, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EmployeeAvailability.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeAvailability.prototype, "employeeId", void 0);
exports.EmployeeAvailability = EmployeeAvailability = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('employee_availability')
], EmployeeAvailability);
//# sourceMappingURL=employee-availability.entity.js.map