"use strict";
/**
 * Delete a task from many / all daily plans
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTaskFromManyPlansDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../core/dto");
class RemoveTaskFromManyPlansDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO) {
}
exports.RemoveTaskFromManyPlansDTO = RemoveTaskFromManyPlansDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", Object)
], RemoveTaskFromManyPlansDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], RemoveTaskFromManyPlansDTO.prototype, "plansIds", void 0);
//# sourceMappingURL=remove-task-from-plans.dto.js.map