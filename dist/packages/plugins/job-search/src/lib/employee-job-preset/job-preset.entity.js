"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPreset = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const core_2 = require("@gauzy/core");
const mikro_orm_job_preset_repository_1 = require("./repository/mikro-orm-job-preset.repository");
const employee_upwork_jobs_search_criterion_entity_1 = require("./employee-upwork-jobs-search-criterion.entity");
const job_preset_upwork_job_search_criterion_entity_1 = require("./job-preset-upwork-job-search-criterion.entity");
let JobPreset = class JobPreset extends core_1.TenantOrganizationBaseEntity {
    constructor(input) {
        super(input);
    }
};
exports.JobPreset = JobPreset;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], JobPreset.prototype, "name", void 0);
tslib_1.__decorate([
    (0, core_2.MultiORMOneToMany)(() => employee_upwork_jobs_search_criterion_entity_1.EmployeeUpworkJobsSearchCriterion, (it) => it.jobPreset, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], JobPreset.prototype, "employeeCriterions", void 0);
tslib_1.__decorate([
    (0, core_2.MultiORMOneToMany)(() => job_preset_upwork_job_search_criterion_entity_1.JobPresetUpworkJobSearchCriterion, (it) => it.jobPreset, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], JobPreset.prototype, "jobPresetCriterions", void 0);
tslib_1.__decorate([
    (0, core_2.MultiORMManyToMany)(() => core_1.Employee, {
        cascade: true,
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true,
        /** Pivot table for many-to-many relationship. */
        pivotTable: 'employee_job_preset',
        /** Column in pivot table referencing 'job_preset' primary key. */
        joinColumn: 'jobPresetId',
        /** Column in pivot table referencing 'employee' primary key. */
        inverseJoinColumn: 'employeeId',
    }),
    (0, typeorm_1.JoinTable)({ name: 'employee_job_preset' }),
    tslib_1.__metadata("design:type", Array)
], JobPreset.prototype, "employees", void 0);
exports.JobPreset = JobPreset = tslib_1.__decorate([
    (0, core_2.MultiORMEntity)('job_preset', { mikroOrmRepository: () => mikro_orm_job_preset_repository_1.MikroOrmJobPresetRepository }),
    tslib_1.__metadata("design:paramtypes", [Object])
], JobPreset);
//# sourceMappingURL=job-preset.entity.js.map