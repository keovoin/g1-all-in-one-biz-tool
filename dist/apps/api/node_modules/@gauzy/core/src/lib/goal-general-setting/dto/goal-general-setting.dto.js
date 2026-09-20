"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalGeneralSettingDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GoalGeneralSettingDTO {
}
exports.GoalGeneralSettingDTO = GoalGeneralSettingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], GoalGeneralSettingDTO.prototype, "maxObjectives", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], GoalGeneralSettingDTO.prototype, "maxKeyResults", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], GoalGeneralSettingDTO.prototype, "employeeCanCreateObjective", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.GoalOwnershipEnum, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.GoalOwnershipEnum),
    tslib_1.__metadata("design:type", String)
], GoalGeneralSettingDTO.prototype, "canOwnObjectives", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.GoalOwnershipEnum, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.GoalOwnershipEnum),
    tslib_1.__metadata("design:type", String)
], GoalGeneralSettingDTO.prototype, "canOwnKeyResult", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], GoalGeneralSettingDTO.prototype, "krTypeKPI", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], GoalGeneralSettingDTO.prototype, "krTypeTask", void 0);
//# sourceMappingURL=goal-general-setting.dto.js.map