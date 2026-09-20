"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodayDateRangeQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../../shared/validators");
class TodayDateRangeQueryDTO {
}
exports.TodayDateRangeQueryDTO = TodayDateRangeQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, validators_1.IsBeforeDate)(TodayDateRangeQueryDTO, (it) => it.todayEnd, {
        message: "Today start date must be before today end date"
    }),
    tslib_1.__metadata("design:type", Date)
], TodayDateRangeQueryDTO.prototype, "todayStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], TodayDateRangeQueryDTO.prototype, "todayEnd", void 0);
//# sourceMappingURL=today-date-range-query.dto.js.map