"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteWorkflowDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * DTO for executing a SIM workflow.
 */
class ExecuteWorkflowDto {
}
exports.ExecuteWorkflowDto = ExecuteWorkflowDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Input data for the workflow' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], ExecuteWorkflowDto.prototype, "input", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Execution timeout in milliseconds', default: 30000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(300000),
    tslib_1.__metadata("design:type", Number)
], ExecuteWorkflowDto.prototype, "timeout", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Run asynchronously', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ExecuteWorkflowDto.prototype, "runAsync", void 0);
//# sourceMappingURL=execute-workflow.dto.js.map