"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDailyPlanDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("../../../core/dto");
const dto_2 = require("../../../employee/dto");
const dto_3 = require("../../../organization-team/dto");
/**
 * Create Daily Plan DTO validation
 */
class CreateDailyPlanDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, dto_2.EmployeeFeatureDTO, dto_3.OrganizationTeamFeatureDTO) {
}
exports.CreateDailyPlanDTO = CreateDailyPlanDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    tslib_1.__metadata("design:type", Date)
], CreateDailyPlanDTO.prototype, "date", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreateDailyPlanDTO.prototype, "workTimePlanned", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DailyPlanStatusEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.DailyPlanStatusEnum, { message: 'status `$value` must be a valid enum value' }),
    tslib_1.__metadata("design:type", String)
], CreateDailyPlanDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateDailyPlanDTO.prototype, "taskId", void 0);
//# sourceMappingURL=create-daily-plan.dto.js.map