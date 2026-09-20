"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeProposalTemplateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@gauzy/core");
const employee_proposal_template_controller_1 = require("./employee-proposal-template.controller");
const employee_proposal_template_entity_1 = require("./employee-proposal-template.entity");
const employee_proposal_template_service_1 = require("./employee-proposal-template.service");
const mikro_orm_employee_proposal_template_repository_1 = require("./repository/mikro-orm-employee-proposal-template.repository");
const type_orm_employee_proposal_template_repository_1 = require("./repository/type-orm-employee-proposal-template.repository");
let EmployeeProposalTemplateModule = class EmployeeProposalTemplateModule {
};
exports.EmployeeProposalTemplateModule = EmployeeProposalTemplateModule;
exports.EmployeeProposalTemplateModule = EmployeeProposalTemplateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_proposal_template_entity_1.EmployeeProposalTemplate]),
            nestjs_1.MikroOrmModule.forFeature([employee_proposal_template_entity_1.EmployeeProposalTemplate]),
            core_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [employee_proposal_template_controller_1.EmployeeProposalTemplateController],
        providers: [employee_proposal_template_service_1.EmployeeProposalTemplateService, type_orm_employee_proposal_template_repository_1.TypeOrmEmployeeProposalTemplateRepository, mikro_orm_employee_proposal_template_repository_1.MikroOrmEmployeeProposalTemplateRepository],
    })
], EmployeeProposalTemplateModule);
//# sourceMappingURL=employee-proposal-template.module.js.map