"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const employment_dto_1 = require("./employment.dto");
const dto_1 = require("./../../tags/dto");
const employee_entity_1 = require("./../employee.entity");
/**
 * EMPLOYEE can updates these fields only
 * Public Fields DTO
 */
class UpdateProfileDTO extends (0, mapped_types_1.IntersectionType)(dto_1.RelationalTagDTO, employment_dto_1.EmploymentDTO, (0, swagger_1.PickType)(employee_entity_1.Employee, [
    'linkedInUrl',
    'facebookUrl',
    'instagramUrl',
    'twitterUrl',
    'githubUrl',
    'gitlabUrl',
    'upworkUrl',
    'stackoverflowUrl'
]), // Networks DTO
(0, swagger_1.PickType)(employee_entity_1.Employee, [
    'billRateValue',
    'billRateCurrency',
    'minimumBillingRate',
    'payPeriod',
    'reWeeklyLimit'
]), (0, swagger_1.PickType)(employee_entity_1.Employee, ['offerDate', 'acceptDate', 'rejectDate']), // Hiring DTO
(0, swagger_1.PickType)(employee_entity_1.Employee, ['upworkId', 'linkedInId', 'profile_link', 'isAway'])) {
}
exports.UpdateProfileDTO = UpdateProfileDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], UpdateProfileDTO.prototype, "contact", void 0);
//# sourceMappingURL=update-profile.dto.js.map