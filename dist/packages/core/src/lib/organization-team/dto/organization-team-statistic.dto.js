"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamStatisticDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const utils_1 = require("@gauzy/utils");
const dto_1 = require("./../../shared/dto");
/**
 * DTO for handling requests related to organization team statistics.
 * Combines date range and relations query features.
 */
class OrganizationTeamStatisticDTO extends (0, swagger_1.IntersectionType)(dto_1.DateRangeQueryDTO, dto_1.RelationsQueryDTO) {
}
exports.OrganizationTeamStatisticDTO = OrganizationTeamStatisticDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? (0, utils_1.parseToBoolean)(value) : false)),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationTeamStatisticDTO.prototype, "withLastWorkedTask", void 0);
//# sourceMappingURL=organization-team-statistic.dto.js.map