"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTrackingDataDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../../../core/dto");
/**
 * DTO for processing custom tracking data
 */
class ProcessTrackingDataDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.ProcessTrackingDataDTO = ProcessTrackingDataDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Encoded tracking data payload'
    }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProcessTrackingDataDTO.prototype, "payload", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        format: 'date-time',
        description: 'Start time for the tracking data. If not provided, current time will be used.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : undefined)),
    tslib_1.__metadata("design:type", Date)
], ProcessTrackingDataDTO.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Employee ID. If not provided, current user employee ID will be used.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ProcessTrackingDataDTO.prototype, "employeeId", void 0);
//# sourceMappingURL=process-tracking-data.dto.js.map