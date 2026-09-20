"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveEmployeePresetDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
/**
 * POST /job-preset/employee body.
 *
 * `employeeId`, when sent, MUST be a real UUID: the handler deletes the employee's existing search
 * criteria by `{ employeeId }`, and a null value used to be dropped from the SQL, turning that into an
 * unfiltered DELETE across every tenant (GHSA-44pv-34gx-q9p4 class). Callers without
 * CHANGE_SELECTED_EMPLOYEE may omit it — the handler pins their own employee and fails closed when
 * there is none.
 */
class SaveEmployeePresetDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.SaveEmployeePresetDTO = SaveEmployeePresetDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], SaveEmployeePresetDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], SaveEmployeePresetDTO.prototype, "jobPresetIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.JobPostSourceEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.JobPostSourceEnum),
    tslib_1.__metadata("design:type", String)
], SaveEmployeePresetDTO.prototype, "source", void 0);
//# sourceMappingURL=save-employee-preset.dto.js.map