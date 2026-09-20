"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackingStatisticQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
const dto_1 = require("../../../shared/dto");
const today_date_range_query_dto_1 = require("./today-date-range-query.dto");
/**
 * Get statistic counts request DTO validation
 */
class TimeTrackingStatisticQueryDTO extends (0, swagger_1.IntersectionType)(dto_1.FiltersQueryDTO, (0, swagger_1.IntersectionType)(dto_1.SelectorsQueryDTO, today_date_range_query_dto_1.TodayDateRangeQueryDTO)) {
    constructor() {
        super(...arguments);
        this.defaultRange = false;
        this.unitOfTime = 'week';
    }
}
exports.TimeTrackingStatisticQueryDTO = TimeTrackingStatisticQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? (0, utils_1.parseToBoolean)(value) : false)),
    tslib_1.__metadata("design:type", Boolean)
], TimeTrackingStatisticQueryDTO.prototype, "defaultRange", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, example: 'week' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], TimeTrackingStatisticQueryDTO.prototype, "unitOfTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    tslib_1.__metadata("design:type", Number)
], TimeTrackingStatisticQueryDTO.prototype, "take", void 0);
//# sourceMappingURL=time-tracking-statistic-query.dto.js.map