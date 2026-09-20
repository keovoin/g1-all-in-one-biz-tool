"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimationDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const class_validator_1 = require("class-validator");
class TaskEstimationDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.TaskEstimationDTO = TaskEstimationDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], TaskEstimationDTO.prototype, "estimate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TaskEstimationDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TaskEstimationDTO.prototype, "taskId", void 0);
//# sourceMappingURL=task-estimation.dto.js.map