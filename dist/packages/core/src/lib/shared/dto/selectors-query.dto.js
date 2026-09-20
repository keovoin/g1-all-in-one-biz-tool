"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorsQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const date_range_query_dto_1 = require("./date-range-query.dto");
/**
 * Data Transfer Object for filtering time logs by various selectors.
 * Extends DateRangeQueryDTO to include date range filters alongside employee, project, task, and team selectors.
 */
class SelectorsQueryDTO extends date_range_query_dto_1.DateRangeQueryDTO {
}
exports.SelectorsQueryDTO = SelectorsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], SelectorsQueryDTO.prototype, "employeeIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], SelectorsQueryDTO.prototype, "projectIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], SelectorsQueryDTO.prototype, "taskIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], SelectorsQueryDTO.prototype, "teamIds", void 0);
//# sourceMappingURL=selectors-query.dto.js.map