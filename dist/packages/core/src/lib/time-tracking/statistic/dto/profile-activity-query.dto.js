"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileActivityQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const moment_extend_1 = require("../../../core/moment-extend");
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_LOCAL_CALENDAR_SPAN_DAYS = 366;
function isStrictLocalDate(value) {
    return typeof value === 'string' && DATE_ONLY_PATTERN.test(value) && (0, moment_extend_1.moment)(value, 'YYYY-MM-DD', true).isValid();
}
function isIanaTimeZone(value) {
    return typeof value === 'string' && moment_extend_1.moment.tz.zone(value) !== null;
}
let IsStrictLocalDateConstraint = class IsStrictLocalDateConstraint {
    validate(value) {
        return isStrictLocalDate(value);
    }
    defaultMessage(args) {
        return `${args.property} must be a valid date in YYYY-MM-DD format`;
    }
};
IsStrictLocalDateConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isStrictLocalDate', async: false })
], IsStrictLocalDateConstraint);
let IsIanaTimeZoneConstraint = class IsIanaTimeZoneConstraint {
    validate(value) {
        return isIanaTimeZone(value);
    }
    defaultMessage(args) {
        return `${args.property} must be a valid IANA time zone`;
    }
};
IsIanaTimeZoneConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isIanaTimeZone', async: false })
], IsIanaTimeZoneConstraint);
let IsProfileActivityDateRangeConstraint = class IsProfileActivityDateRangeConstraint {
    validate(_value, args) {
        const query = args.object;
        if (!isStrictLocalDate(query.startDate) ||
            !isStrictLocalDate(query.endDate) ||
            !isIanaTimeZone(query.timeZone)) {
            return true;
        }
        const start = moment_extend_1.moment.utc(query.startDate, 'YYYY-MM-DD', true);
        const end = moment_extend_1.moment.utc(query.endDate, 'YYYY-MM-DD', true);
        const localCalendarSpanDays = end.diff(start, 'days');
        return end.isAfter(start) && localCalendarSpanDays <= MAX_LOCAL_CALENDAR_SPAN_DAYS;
    }
    defaultMessage() {
        return `endDate must be after startDate and the half-open date span must not exceed ${MAX_LOCAL_CALENDAR_SPAN_DAYS} local calendar days`;
    }
};
IsProfileActivityDateRangeConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isProfileActivityDateRange', async: false })
], IsProfileActivityDateRangeConstraint);
class ProfileActivityQueryDTO {
    constructor() {
        this.includeDaily = false;
    }
}
exports.ProfileActivityQueryDTO = ProfileActivityQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ProfileActivityQueryDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ProfileActivityQueryDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ProfileActivityQueryDTO.prototype, "organizationTeamId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, example: '2024-01-01', description: 'Inclusive local calendar date' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(IsStrictLocalDateConstraint),
    tslib_1.__metadata("design:type", String)
], ProfileActivityQueryDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, example: '2024-01-31', description: 'Exclusive local calendar date' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(IsStrictLocalDateConstraint),
    (0, class_validator_1.Validate)(IsProfileActivityDateRangeConstraint),
    tslib_1.__metadata("design:type", String)
], ProfileActivityQueryDTO.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, example: 'America/New_York' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(IsIanaTimeZoneConstraint),
    tslib_1.__metadata("design:type", String)
], ProfileActivityQueryDTO.prototype, "timeZone", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ProfileActivityQueryDTO.prototype, "includeDaily", void 0);
//# sourceMappingURL=profile-activity-query.dto.js.map