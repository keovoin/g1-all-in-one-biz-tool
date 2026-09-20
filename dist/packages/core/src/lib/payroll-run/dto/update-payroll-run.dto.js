"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePayrollRunDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_payroll_run_dto_1 = require("./create-payroll-run.dto");
/**
 * Update Payroll Run request DTO.
 *
 * Derived from the create DTO, so `status`, `totalGross`, `totalDeductions` and `totalNet` cannot
 * be set here either. Combined with `whitelist: true` on the endpoint, a body carrying them is
 * stripped rather than silently applied.
 */
class UpdatePayrollRunDTO extends (0, swagger_1.PartialType)(create_payroll_run_dto_1.CreatePayrollRunDTO) {
}
exports.UpdatePayrollRunDTO = UpdatePayrollRunDTO;
//# sourceMappingURL=update-payroll-run.dto.js.map