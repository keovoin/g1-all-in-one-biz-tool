"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRunQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const validators_1 = require("./../../shared/validators");
/**
 * Query filters for listing payroll runs.
 */
class PayrollRunQueryDTO {
}
exports.PayrollRunQueryDTO = PayrollRunQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, validators_1.IsOrganizationBelongsToUser)(),
    tslib_1.__metadata("design:type", String)
], PayrollRunQueryDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PayrollRunStatusEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollRunStatusEnum),
    tslib_1.__metadata("design:type", String)
], PayrollRunQueryDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PayrollFrequencyEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollFrequencyEnum),
    tslib_1.__metadata("design:type", String)
], PayrollRunQueryDTO.prototype, "frequency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date, description: 'Lower bound of the periodStart range' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], PayrollRunQueryDTO.prototype, "periodStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date, description: 'Upper bound of the periodStart range' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], PayrollRunQueryDTO.prototype, "periodEnd", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: '1-based page number' }),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === null ? value : Number(value))),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], PayrollRunQueryDTO.prototype, "page", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Rows per page, 1-100' }),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === null ? value : Number(value))),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    tslib_1.__metadata("design:type", Number)
], PayrollRunQueryDTO.prototype, "limit", void 0);
//# sourceMappingURL=payroll-run-query.dto.js.map