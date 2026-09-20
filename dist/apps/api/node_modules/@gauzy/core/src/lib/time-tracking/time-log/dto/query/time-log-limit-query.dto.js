"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogLimitQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const time_log_query_dto_1 = require("./time-log-query.dto");
/**
 * Get time log daily/weekly limit request DTO validation
 */
class TimeLogLimitQueryDTO extends (0, swagger_1.OmitType)(time_log_query_dto_1.TimeLogQueryDTO, ['timesheetId']) {
}
exports.TimeLogLimitQueryDTO = TimeLogLimitQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], TimeLogLimitQueryDTO.prototype, "duration", void 0);
//# sourceMappingURL=time-log-limit-query.dto.js.map