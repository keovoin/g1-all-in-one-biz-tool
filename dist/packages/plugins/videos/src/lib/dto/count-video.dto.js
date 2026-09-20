"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountVideoDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Entity Count Video DTO
 *
 * Represents the DTO for counting videos within a specific tenant and organization,
 * optionally filtered by a date range.
 */
class CountVideoDTO {
}
exports.CountVideoDTO = CountVideoDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the tenant.',
        example: 'd3b07384-d9a0-4d5f-bf6d-f1b5b71e9a37',
        type: String
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'tenantId must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CountVideoDTO.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the organization within the tenant.',
        example: 'a9e3fbc9-d0b7-4e85-b6f2-2eaf3a5d72dc',
        type: String
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'organizationId must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CountVideoDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The start date for filtering video records. Can be provided as a string or a Date object.',
        example: '2023-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({ strict: true }, { message: 'startDate must be a valid ISO 8601 date string' }),
    tslib_1.__metadata("design:type", Object)
], CountVideoDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The end date for filtering video records. Can be provided as a string or a Date object.',
        example: '2023-12-31T23:59:59.999Z',
        type: 'string',
        format: 'date-time',
        nullable: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({ strict: true }, { message: 'endDate must be a valid ISO 8601 date string' }),
    tslib_1.__metadata("design:type", Object)
], CountVideoDTO.prototype, "endDate", void 0);
//# sourceMappingURL=count-video.dto.js.map