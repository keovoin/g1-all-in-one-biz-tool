"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSoundshotsQueryDTO = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class GetSoundshotsQueryDTO extends (0, swagger_1.OmitType)((core_1.BaseQueryDTO), ['where']) {
}
exports.GetSoundshotsQueryDTO = GetSoundshotsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The start date for filtering soundshot records.',
        type: 'string',
        format: 'date-time',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({ strict: true }, { message: 'startDate must be a valid ISO 8601 date string' }),
    (0, class_transformer_1.Type)(() => Date),
    tslib_1.__metadata("design:type", Object)
], GetSoundshotsQueryDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The end date for filtering soundshot records.',
        type: 'string',
        format: 'date-time',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({ strict: true }, { message: 'endDate must be a valid ISO 8601 date string' }),
    (0, class_transformer_1.Type)(() => Date),
    tslib_1.__metadata("design:type", Object)
], GetSoundshotsQueryDTO.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The ID of the tenant.',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'tenantId must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], GetSoundshotsQueryDTO.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The ID of the organization within the tenant.',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'organizationId must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], GetSoundshotsQueryDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of employee IDs to filter soundshots by.',
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each employeeId must be a valid UUID' }),
    tslib_1.__metadata("design:type", Array)
], GetSoundshotsQueryDTO.prototype, "employeeIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The timezone for date filtering, e.g., "UTC", "America/New_York".',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'timeZone must be a string' }),
    tslib_1.__metadata("design:type", String)
], GetSoundshotsQueryDTO.prototype, "timeZone", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], GetSoundshotsQueryDTO.prototype, "where", void 0);
//# sourceMappingURL=get-soundshots-query.dto.js.map