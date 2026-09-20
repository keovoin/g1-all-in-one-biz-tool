"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutionQueryDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/**
 * DTO for querying execution history.
 */
class WorkflowExecutionQueryDto {
}
exports.WorkflowExecutionQueryDto = WorkflowExecutionQueryDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by workflow ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], WorkflowExecutionQueryDto.prototype, "workflowId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by execution status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], WorkflowExecutionQueryDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of records to return', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    tslib_1.__metadata("design:type", Number)
], WorkflowExecutionQueryDto.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of records to skip', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], WorkflowExecutionQueryDto.prototype, "offset", void 0);
//# sourceMappingURL=workflow-query.dto.js.map