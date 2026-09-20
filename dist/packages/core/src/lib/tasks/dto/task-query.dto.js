"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const crud_1 = require("../../core/crud");
const task_advanced_filter_dto_1 = require("./task-advanced-filter.dto");
class TaskQueryDTO extends crud_1.BaseQueryDTO {
}
exports.TaskQueryDTO = TaskQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: task_advanced_filter_dto_1.TaskAdvancedFilterDTO }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => task_advanced_filter_dto_1.TaskAdvancedFilterDTO),
    tslib_1.__metadata("design:type", task_advanced_filter_dto_1.TaskAdvancedFilterDTO)
], TaskQueryDTO.prototype, "filters", void 0);
//# sourceMappingURL=task-query.dto.js.map