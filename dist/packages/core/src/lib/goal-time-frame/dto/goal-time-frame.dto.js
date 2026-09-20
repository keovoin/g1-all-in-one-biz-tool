"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTimeFrameDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GoalTimeFrameDTO {
}
exports.GoalTimeFrameDTO = GoalTimeFrameDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GoalTimeFrameDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.TimeFrameStatusEnum, readOnly: true }),
    (0, class_validator_1.IsEnum)(contracts_1.TimeFrameStatusEnum),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], GoalTimeFrameDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Date)
], GoalTimeFrameDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Date)
], GoalTimeFrameDTO.prototype, "endDate", void 0);
//# sourceMappingURL=goal-time-frame.dto.js.map