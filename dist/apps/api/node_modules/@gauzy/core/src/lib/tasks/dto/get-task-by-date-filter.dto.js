"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDateFilterInputDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../../core/dto");
const validators_1 = require("./../../shared/validators");
class TaskDateFilterInputDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.TaskDateFilterInputDTO = TaskDateFilterInputDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, validators_1.IsBeforeDate)(TaskDateFilterInputDTO, (it) => it.startDateTo, {
        message: 'Start date from must be before the start date to'
    }),
    tslib_1.__metadata("design:type", Date)
], TaskDateFilterInputDTO.prototype, "startDateFrom", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.ValidateIf)((o) => o.startDateFrom != null),
    tslib_1.__metadata("design:type", Date)
], TaskDateFilterInputDTO.prototype, "startDateTo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, validators_1.IsBeforeDate)(TaskDateFilterInputDTO, (it) => it.dueDateTo, {
        message: 'Due date from must be before the due date to'
    }),
    tslib_1.__metadata("design:type", Date)
], TaskDateFilterInputDTO.prototype, "dueDateFrom", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.ValidateIf)((o) => o.dueDateFrom != null),
    tslib_1.__metadata("design:type", Date)
], TaskDateFilterInputDTO.prototype, "dueDateTo", void 0);
//# sourceMappingURL=get-task-by-date-filter.dto.js.map