"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeBulkInputDTO = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_employee_dto_1 = require("./create-employee.dto");
class EmployeeBulkInputDTO {
}
exports.EmployeeBulkInputDTO = EmployeeBulkInputDTO;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_employee_dto_1.CreateEmployeeDTO),
    tslib_1.__metadata("design:type", Array)
], EmployeeBulkInputDTO.prototype, "list", void 0);
//# sourceMappingURL=employee-bulk-input.dto.js.map