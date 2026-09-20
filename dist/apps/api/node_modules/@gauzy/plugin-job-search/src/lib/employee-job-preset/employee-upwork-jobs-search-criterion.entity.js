"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeUpworkJobsSearchCriterion = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const job_preset_entity_1 = require("./job-preset.entity");
const job_search_occupation_entity_1 = require("./job-search-occupation/job-search-occupation.entity");
const job_search_category_entity_1 = require("./job-search-category/job-search-category.entity");
const mikro_orm_employee_upwork_jobs_search_criterion_entity_repository_1 = require("./repository/mikro-orm-employee-upwork-jobs-search-criterion.entity.repository");
let EmployeeUpworkJobsSearchCriterion = class EmployeeUpworkJobsSearchCriterion extends core_1.TenantOrganizationBaseEntity {
    constructor(input) {
        super(input);
    }
};
exports.EmployeeUpworkJobsSearchCriterion = EmployeeUpworkJobsSearchCriterion;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeUpworkJobsSearchCriterion.prototype, "keyword", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeUpworkJobsSearchCriterion.prototype, "jobType", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => job_preset_entity_1.JobPreset, (it) => it.employeeCriterions, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EmployeeUpworkJobsSearchCriterion.prototype, "jobPreset", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.RelationId)((it) => it.jobPreset),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeUpworkJobsSearchCriterion.prototype, "jobPresetId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EmployeeUpworkJobsSearchCriterion.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeUpworkJobsSearchCriterion.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => job_search_occupation_entity_1.JobSearchOccupation, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EmployeeUpworkJobsSearchCriterion.prototype, "occupation", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.occupation),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeUpworkJobsSearchCriterion.prototype, "occupationId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => job_search_category_entity_1.JobSearchCategory, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EmployeeUpworkJobsSearchCriterion.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.category),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeUpworkJobsSearchCriterion.prototype, "categoryId", void 0);
exports.EmployeeUpworkJobsSearchCriterion = EmployeeUpworkJobsSearchCriterion = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('employee_upwork_job_search_criterion', { mikroOrmRepository: () => mikro_orm_employee_upwork_jobs_search_criterion_entity_repository_1.MikroOrmEmployeeUpworkJobsSearchCriterionRepository }),
    tslib_1.__metadata("design:paramtypes", [Object])
], EmployeeUpworkJobsSearchCriterion);
//# sourceMappingURL=employee-upwork-jobs-search-criterion.entity.js.map