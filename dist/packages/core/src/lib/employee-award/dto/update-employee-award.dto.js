"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeAwardDTO = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Update employee award DTO validation
 */
class UpdateEmployeeAwardDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.UpdateEmployeeAwardDTO = UpdateEmployeeAwardDTO;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], UpdateEmployeeAwardDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], UpdateEmployeeAwardDTO.prototype, "year", void 0);
//# sourceMappingURL=update-employee-award.dto.js.map