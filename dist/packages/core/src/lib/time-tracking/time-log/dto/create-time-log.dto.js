"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateManualTimeLogDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const manual_time_log_dto_1 = require("./manual-time-log.dto");
/**
 * DTO for creating manual time logs.
 * Extends ManualTimeLogDTO and implements IManualTimeInput.
 */
class CreateManualTimeLogDTO extends manual_time_log_dto_1.ManualTimeLogDTO {
}
exports.CreateManualTimeLogDTO = CreateManualTimeLogDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.TimeLogType }),
    (0, class_validator_1.IsEnum)(contracts_1.TimeLogType),
    (0, class_transformer_1.Transform)(() => contracts_1.TimeLogType.MANUAL),
    tslib_1.__metadata("design:type", String)
], CreateManualTimeLogDTO.prototype, "logType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.TimeLogSourceEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.TimeLogSourceEnum),
    (0, class_transformer_1.Transform)(() => contracts_1.TimeLogSourceEnum.WEB_TIMER),
    tslib_1.__metadata("design:type", String)
], CreateManualTimeLogDTO.prototype, "source", void 0);
//# sourceMappingURL=create-time-log.dto.js.map