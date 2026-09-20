"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTaskByIdDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const crud_1 = require("../../core/crud");
/**
 * GET task by Id DTO validation
 */
class GetTaskByIdDTO extends crud_1.FindOptionsQueryDTO {
}
exports.GetTaskByIdDTO = GetTaskByIdDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], GetTaskByIdDTO.prototype, "includeRootEpic", void 0);
//# sourceMappingURL=get-task-by-id.dto.js.map