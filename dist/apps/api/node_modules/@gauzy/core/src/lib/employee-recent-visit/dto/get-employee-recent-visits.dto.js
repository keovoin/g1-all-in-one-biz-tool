"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEmployeeRecentVisitsDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../../core/crud");
const dto_1 = require("../../core/dto");
const employee_recent_visit_entity_1 = require("../employee-recent-visit.entity");
/** Filters for EmployeeRecentVisits */
class GetEmployeeRecentVisitsDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)((crud_1.BaseQueryDTO), ['skip', 'take', 'relations']), (0, swagger_1.PickType)(employee_recent_visit_entity_1.EmployeeRecentVisit, ['isActive', 'isArchived', 'employeeId'])) {
}
exports.GetEmployeeRecentVisitsDTO = GetEmployeeRecentVisitsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    tslib_1.__metadata("design:type", String)
], GetEmployeeRecentVisitsDTO.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], GetEmployeeRecentVisitsDTO.prototype, "entityId", void 0);
//# sourceMappingURL=get-employee-recent-visits.dto.js.map