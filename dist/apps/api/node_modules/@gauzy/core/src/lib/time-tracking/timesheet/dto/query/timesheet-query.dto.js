"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../../../shared/dto");
/**
 * Get timesheet request DTO validation
 */
class TimesheetQueryDTO extends (0, swagger_1.IntersectionType)(dto_1.RelationsQueryDTO, dto_1.SelectorsQueryDTO) {
}
exports.TimesheetQueryDTO = TimesheetQueryDTO;
tslib_1.__decorate([
    (0, swagger_2.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], TimesheetQueryDTO.prototype, "status", void 0);
//# sourceMappingURL=timesheet-query.dto.js.map