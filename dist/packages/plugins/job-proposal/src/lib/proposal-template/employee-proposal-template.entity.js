"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeProposalTemplate = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const mikro_orm_employee_proposal_template_repository_1 = require("./repository/mikro-orm-employee-proposal-template.repository");
let EmployeeProposalTemplate = class EmployeeProposalTemplate extends core_1.TenantOrganizationBaseEntity {
};
exports.EmployeeProposalTemplate = EmployeeProposalTemplate;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.ColumnIndex)() // Adds an index on the 'name' column for faster queries
    ,
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmployeeProposalTemplate.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.ColumnIndex)({ fulltext: true }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeProposalTemplate.prototype, "content", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeProposalTemplate.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], EmployeeProposalTemplate.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeProposalTemplate.prototype, "employeeId", void 0);
exports.EmployeeProposalTemplate = EmployeeProposalTemplate = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('employee_proposal_template', { mikroOrmRepository: () => mikro_orm_employee_proposal_template_repository_1.MikroOrmEmployeeProposalTemplateRepository })
], EmployeeProposalTemplate);
//# sourceMappingURL=employee-proposal-template.entity.js.map