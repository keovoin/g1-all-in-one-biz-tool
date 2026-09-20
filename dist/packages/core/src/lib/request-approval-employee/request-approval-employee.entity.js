"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalEmployee = void 0;
const tslib_1 = require("tslib");
/*
  - Request Approval Employee table is the third table which will combine the employee table and the request approval table.
  - Request Approval Employee table has the many to one relationship to the RequestApproval table and the Employee table by requestApprovalId and employeeId
*/
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_request_approval_employee_repository_1 = require("./repository/mikro-orm-request-approval-employee.repository");
let RequestApprovalEmployee = class RequestApprovalEmployee extends internal_1.TenantOrganizationBaseEntity {
};
exports.RequestApprovalEmployee = RequestApprovalEmployee;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestApprovalEmployee.prototype, "status", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.RequestApproval, (requestApproval) => requestApproval.employeeApprovals, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], RequestApprovalEmployee.prototype, "requestApproval", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.requestApproval),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], RequestApprovalEmployee.prototype, "requestApprovalId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (employee) => employee.requestApprovals, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], RequestApprovalEmployee.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], RequestApprovalEmployee.prototype, "employeeId", void 0);
exports.RequestApprovalEmployee = RequestApprovalEmployee = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('request_approval_employee', { mikroOrmRepository: () => mikro_orm_request_approval_employee_repository_1.MikroOrmRequestApprovalEmployeeRepository })
], RequestApprovalEmployee);
//# sourceMappingURL=request-approval-employee.entity.js.map