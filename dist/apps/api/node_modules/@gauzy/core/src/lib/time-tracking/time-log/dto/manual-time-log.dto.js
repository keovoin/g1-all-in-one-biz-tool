"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualTimeLogDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../../shared/validators");
const dto_1 = require("./../../../core/dto");
/**
 * Data transfer object for creating or updating ManualTimeLog entities.
 */
class ManualTimeLogDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.ManualTimeLogDTO = ManualTimeLogDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)({ message: "Started date should not be empty" }),
    (0, validators_1.IsBeforeDate)(ManualTimeLogDTO, (it) => it.stoppedAt, {
        message: "Started date must be before stopped date"
    }),
    tslib_1.__metadata("design:type", Date)
], ManualTimeLogDTO.prototype, "startedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)({ message: "Stopped date should not be empty" }),
    tslib_1.__metadata("design:type", Date)
], ManualTimeLogDTO.prototype, "stoppedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", Object)
], ManualTimeLogDTO.prototype, "employeeId", void 0);
//# sourceMappingURL=manual-time-log.dto.js.map