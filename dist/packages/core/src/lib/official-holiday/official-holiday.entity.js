"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficialHoliday = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_official_holiday_repository_1 = require("./repository/mikro-orm-official-holiday.repository");
/**
 * A publicly recognized holiday for a country, kept per organization.
 *
 * Issue #314 asks for an `OfficialHolidays` table so the "Add Holidays" dialog can offer a
 * predefined list of national holidays and pre-fill the From/To dates once one is picked,
 * filtered by the organization's country setting.
 *
 * Dates are stored as `date`, not as timestamps: a public holiday is a calendar day, and storing
 * it with a time component makes it land on the wrong day for anybody in another timezone.
 */
let OfficialHoliday = class OfficialHoliday extends internal_1.TenantOrganizationBaseEntity {
};
exports.OfficialHoliday = OfficialHoliday;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Display name of the holiday, e.g. "Christmas Day"' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 200),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OfficialHoliday.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'ISO 3166-1 alpha-2 country code, e.g. "US", "DE"' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 2),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ length: 2 }),
    tslib_1.__metadata("design:type", String)
], OfficialHoliday.prototype, "countryCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date, description: 'The holiday date, or the first day of a multi-day holiday' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'date' }),
    tslib_1.__metadata("design:type", Date)
], OfficialHoliday.prototype, "date", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date, description: 'Last day of a multi-day holiday' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ type: 'date', nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OfficialHoliday.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, description: 'Whether the holiday falls on the same date every year' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: true }),
    tslib_1.__metadata("design:type", Boolean)
], OfficialHoliday.prototype, "isRecurring", void 0);
exports.OfficialHoliday = OfficialHoliday = tslib_1.__decorate([
    (0, entity_1.ColumnIndex)('IDX_official_holiday_unique', ['tenantId', 'organizationId', 'countryCode', 'date', 'name'], {
        unique: true
    }),
    (0, entity_1.MultiORMEntity)('official_holiday', { mikroOrmRepository: () => mikro_orm_official_holiday_repository_1.MikroOrmOfficialHolidayRepository })
], OfficialHoliday);
//# sourceMappingURL=official-holiday.entity.js.map